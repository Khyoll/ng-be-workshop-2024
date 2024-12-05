import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {

  updateJson(tree, '/nx.json', config => {
    config.defaultProject = 'movieApp'

    return config;
  });

  // const projectRoot = `libs/${options.name}`;
  // addProjectConfiguration(tree, options.name, {
  //   root: projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${projectRoot}/src`,
  //   targets: {},
  // });
  // generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;
