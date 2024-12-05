import {
  formatFiles,
  getProjects,
  Tree,
  updateJson
} from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

const UTIL_LIB_PATH = '/libs/internal-plugin/src/generators/util-lib'

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {

  const scopes = getAllScopes(tree);
  updateJson(tree, `${UTIL_LIB_PATH}/schema.json`, utilLibSchema => ({
    ...utilLibSchema,
    properties:{
      ...utilLibSchema.properties,
      directory: {
        ...utilLibSchema.properties.directory,
        enum: scopes,
        'x-prompt': {
          ...utilLibSchema.properties.directory['x-prompt'],
          items: [
            scopes.map(scope => ({
              value: scope,
              label: scope
            }))
          ]
        }
      }
    }
  }));

  const utilLibSchemaContent = tree.read(`${UTIL_LIB_PATH}/Schema.d.ts`);
  tree.write(`${UTIL_LIB_PATH}/Schema.d.ts`, replaceScopes(utilLibSchemaContent.toString(), scopes));

  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;

function getAllScopes(tree: Tree): string[] {
  const allScopes: string[] = Array.from(getProjects(tree).values())
    .map((project) => {
      if (project.tags) {
        const scopes = project.tags.filter((tag: string) => tag.startsWith('scope:'));
        return scopes;
      }
      return [];
    })
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));

  return Array.from(new Set(allScopes));
}

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface UtilLibGeneratorSchema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface UtilLibGeneratorSchema {
  name: string;
  directory: ${joinScopes};
}`
  );
}