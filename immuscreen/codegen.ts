import { CodegenConfig } from '@graphql-codegen/cli';
import Config from "./src/config.json"

const config: CodegenConfig = {
  schema: Config.API.CcreAPI,
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/': {
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