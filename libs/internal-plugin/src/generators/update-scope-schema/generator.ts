import {
  formatFiles,
  getProjects,
  Tree,
  updateJson
} from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {

  const scopes = getAllScopes(tree);
  updateJson(tree, '/libs/internal-plugin/src/generators/util-lib/schema.json', utilLibSchema => ({
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