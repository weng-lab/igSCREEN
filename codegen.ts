import { CodegenConfig } from '@graphql-codegen/cli';
import Config from "./src/config.json"

const config: CodegenConfig = {
  schema: [
    {
      [Config.API.CcreAPI]: {
        headers: {
          "api-key": process.env.SCREEN_API_KEY!,
        },
      },
    },
  ],
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
  ignoreNoDocuments: true,
};

export default config;