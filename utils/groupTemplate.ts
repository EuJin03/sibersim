import { Group, Result } from '@/constants/Types';

export interface GroupResult {
  templateId: string;
  userResults: Result[];
}

export function groupTemplate(group: Group): GroupResult[] {
  const formattedData: GroupResult[] = [];
  const grouped: { [templateId: string]: Result[] } = {};

  for (const result of group.results) {
    const { templateId } = result;

    if (!grouped[templateId]) {
      grouped[templateId] = [];
    }

    grouped[templateId].push(result);
  }

  for (const [templateId, userResults] of Object.entries(grouped)) {
    formattedData.push({ templateId, userResults });
  }

  return formattedData;
}
