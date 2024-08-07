import { create } from 'zustand';
import { Group, User, Result } from '@/constants/Types';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { generateUUID } from '@/hooks/useUuid';
import useUserStore from '@/hooks/useUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUsersStore from '@/hooks/useUsers';

export interface GroupState {
  groups: Group[];
  groupDetail: Group | null;
  results: Result[];
  loading: boolean;
  error: Error | null;
  createGroup: (
    groupData: Omit<Group, 'id'>,
    userId: string
  ) => Promise<Group | null>;
  joinGroup: (invitationLink: string, userId: string) => Promise<void>;
  leaveGroup: (invitationLink: string, userId: string) => Promise<void>;
  getGroupByInvitationLink: (invitationLink: string) => Promise<void>;
  updateGroup: (
    invitationLink: string,
    updatedData: Partial<Group>
  ) => Promise<void>;
  fetchResults: (invitationLink: string) => Promise<void>;
  addResult: (
    invitationLink: string,
    templateId: string,
    members: string[],
    uniqueId: string
  ) => Promise<void>;
  resetState: () => void;
  fetchGroupUsers: (groupId: string) => Promise<User[]>;
}

const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  groupDetail: null,
  results: [],
  loading: false,
  error: null,

  createGroup: async (groupData, userId) => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const usersCollection = collection(getFirestore(), 'users');
      const userDocRef = doc(usersCollection, userId);
      const userDoc = await getDoc(userDocRef);
      const userData = { id: userDoc.id, ...(userDoc.data() as User) };

      if (userData.group) {
        throw new Error('User is already in a group');
      }

      const invitationLink = generateUUID(8);
      const newGroup: Group = {
        id: invitationLink,
        ...groupData,
        members: [userId],
        invitationLink,
        results: [],
      };
      const snapshot = await getDocs(groupsCollection);
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Group),
      }));
      await setDoc(doc(groupsCollection, invitationLink), newGroup);
      await updateDoc(userDocRef, { group: invitationLink });

      set(state => ({
        groups: [...state.groups, newGroup],
        groupDetail: newGroup,
        loading: false,
      }));

      const user = { ...userData, group: invitationLink };
      await AsyncStorage.setItem('dbUser', JSON.stringify(user));

      useUserStore.getState().setDbUser(user);

      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      set({ error: error as Error, loading: false });
      return null;
    }
  },

  joinGroup: async (invitationLink, userId) => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        throw new Error('Group does not exist');
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupDocRef = doc(groupsCollection, groupDoc.id);

      const usersCollection = collection(getFirestore(), 'users');
      const userDocRef = doc(usersCollection, userId);
      const userDoc = await getDoc(userDocRef);
      const userData = { id: userDoc.id, ...(userDoc.data() as User) };

      if (userData.group) {
        throw new Error('User is already in a group');
      }

      await updateDoc(groupDocRef, {
        members: arrayUnion(userId),
      });
      await updateDoc(userDocRef, { group: invitationLink });

      const updatedGroupData = {
        id: groupDoc.id,
        ...(groupDoc.data() as Group),
        members: [...(groupDoc.data() as Group).members, userId],
      };

      set(state => ({
        groups: state.groups.map(group =>
          group.invitationLink === invitationLink ? updatedGroupData : group
        ),
        groupDetail: updatedGroupData,
        loading: false,
      }));

      useUserStore.getState().setDbUser({ ...userData, group: invitationLink });

      const user = { ...userData, group: invitationLink };
      await AsyncStorage.setItem('dbUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error joining group:', error);
      set({ error: error as Error, loading: false });
    }
  },

  leaveGroup: async (invitationLink, userId) => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        throw new Error('Group does not exist');
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupDocRef = doc(groupsCollection, groupDoc.id);

      await updateDoc(groupDocRef, {
        members: arrayRemove(userId),
      });

      const updatedGroupData = {
        id: groupDoc.id,
        ...(groupDoc.data() as Group),
        members: (groupDoc.data() as Group).members.filter(
          memberId => memberId !== userId
        ),
      };

      set(state => ({
        groups: state.groups.map(group =>
          group.invitationLink === invitationLink ? updatedGroupData : group
        ),
        groupDetail:
          state.groupDetail?.invitationLink === invitationLink
            ? updatedGroupData
            : state.groupDetail,
        loading: false,
      }));
      const usersCollection = collection(getFirestore(), 'users');
      const userDocRef = doc(usersCollection, userId);
      await updateDoc(userDocRef, { group: '' });

      const userDoc = await getDoc(userDocRef);
      const userData = {
        id: userDoc.id,
        ...(userDoc.data() as User),
        group: '',
      };

      useUserStore.getState().setDbUser(userData);

      await AsyncStorage.setItem('dbUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Error leaving group:', error);
      set({ error: error as Error, loading: false });
    }
  },

  getGroupByInvitationLink: async invitationLink => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        set({ groupDetail: null, loading: false });
        return;
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupData = {
        id: groupDoc.id,
        ...(groupDoc.data() as Group),
      };

      set(state => ({
        groups: state.groups.map(group =>
          group.invitationLink === invitationLink ? groupData : group
        ),
        groupDetail: groupData,
        loading: false,
      }));
    } catch (error) {
      console.error('Error getting group by invitation link:', error);
      set({ error: error as Error, loading: false });
    }
  },

  updateGroup: async (invitationLink, updatedData) => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        throw new Error('Group does not exist');
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupDocRef = doc(groupsCollection, groupDoc.id);

      await updateDoc(groupDocRef, updatedData);

      const updatedGroupData = {
        id: groupDoc.id,
        ...(groupDoc.data() as Group),
        ...updatedData,
      };

      set(state => ({
        groups: state.groups.map(group =>
          group.invitationLink === invitationLink ? updatedGroupData : group
        ),
        groupDetail:
          state.groupDetail?.invitationLink === invitationLink
            ? updatedGroupData
            : state.groupDetail,
        loading: false,
      }));
    } catch (error) {
      console.error('Error updating group:', error);
      set({ error: error as Error, loading: false });
    }
  },

  fetchResults: async invitationLink => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        set({ results: [], loading: false });
        return;
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupData = groupDoc.data() as Group;

      set(state => ({
        results: groupData.results || [],
        groupDetail:
          state.groupDetail?.invitationLink === invitationLink
            ? { ...state.groupDetail, results: groupData.results || [] }
            : state.groupDetail,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching results:', error);
      set({ error: error as Error, loading: false });
    }
  },

  addResult: async (invitationLink, templateId, members, uniqueId) => {
    try {
      set({ loading: true, error: null });
      const groupsCollection = collection(getFirestore(), 'groups');
      const groupQuery = query(
        groupsCollection,
        where('invitationLink', '==', invitationLink)
      );
      const groupSnapshot = await getDocs(groupQuery);

      if (groupSnapshot.empty) {
        throw new Error('Group does not exist');
      }

      const groupDoc = groupSnapshot.docs[0];
      const groupDocRef = doc(groupsCollection, groupDoc.id);
      const groupData = groupDoc.data() as Group;

      // Remove previous results with the same templateId
      const filteredResults =
        groupData.results?.filter(result => result.templateId !== templateId) ||
        [];

      const newResults: Result[] = await Promise.all(
        members.map(async userId => {
          const userDocRef = doc(getFirestore(), 'users', userId);
          const docSnapshot = await getDoc(userDocRef);

          const userData = {
            id: docSnapshot.id,
            ...(docSnapshot.data() as User),
          };
          return {
            id: generateUUID(10),
            comment: 'User has not clicked the phishing link yet',
            templateId: templateId,
            user: userId,
            username: userData.displayName,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      const updatedResults: Result[] = [...filteredResults, ...newResults];

      await updateDoc(groupDocRef, {
        results: updatedResults,
      });

      const updatedGroupData: Group = {
        ...groupData,
        results: updatedResults,
      };

      set((state: GroupState) => ({
        groups: state.groups.map(group =>
          group.invitationLink === invitationLink ? updatedGroupData : group
        ),
        groupDetail:
          state.groupDetail?.invitationLink === invitationLink
            ? updatedGroupData
            : state.groupDetail,
        results: updatedResults,
        loading: false,
      }));

      console.log('Results updated successfully:', updatedResults);
    } catch (error) {
      console.error('Error adding result:', error);
      set({ error: error as Error, loading: false });
    }
  },
  resetState: () => {
    set({
      groups: [],
      groupDetail: null,
      results: [],
      loading: false,
      error: null,
    });
  },

  fetchGroupUsers: async (groupId: string) => {
    try {
      const groupDocRef = doc(getFirestore(), 'groups', groupId);
      const groupDoc = await getDoc(groupDocRef);
      if (groupDoc.exists()) {
        const groupData = groupDoc.data() as Group;
        const userPromises = groupData.members.map(async userId => {
          const userDoc = await getDoc(doc(getFirestore(), 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            const userProgress = await useUsersStore
              .getState()
              .getUserProgressByUserId(userId);
            const points = userProgress.reduce((total, progress) => {
              const completedLessons = progress.completedTopics.length;
              return total + completedLessons * 10; // Allocate 10 points for each completed lesson
            }, 0);
            return { ...userData, points };
          }
          return null;
        });
        const users = await Promise.all(userPromises);
        return users.filter(user => user !== null);
      }
      return [];
    } catch (error) {
      console.error('Error fetching group users:', error);
      return [];
    }
  },
}));

export default useGroupStore;
