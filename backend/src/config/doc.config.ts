import { registerAs } from '@nestjs/config';

export type DocConfig = {
  name: string;
  description: string;
  prefix: string;
};

export default registerAs('docs', () => {
  return {
    name: `${process.env.APP_NAME ?? 'Nestjs App'} APIs Specification`,
    description: 'Section for describe whole APIs',
    prefix: '/docs',
  };
});
