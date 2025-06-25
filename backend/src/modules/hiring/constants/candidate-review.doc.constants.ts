interface DocField {
  name: string;
  allowEmptyValue: boolean;
  required: boolean;
  type: string;
  example: any;
  description?: string;
}

export const CandidateDocQueryCandidateId: DocField[] = [
  {
    name: 'candidate',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'd8c8fca1-4a00-4c1d-b60a-9fd2b4c31212',
  },
];

export const CandidateDocQueryMore: DocField[] = [
  {
    name: 'more',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: '10,20',
  },
];
