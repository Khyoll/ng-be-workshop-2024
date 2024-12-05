import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import * as path from 'path';
import { UtilLibGeneratorSchema } from './schema';

export async function utilLibGenerator(
  tree: Tree,
  options: UtilLibGeneratorSchema
) {
  await libraryGenerator(tree, {
    directory:  options.directory + '/util-' + options.name
  });

  console.log('from generator - ' + options.name);

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

export default utilLibGenerator;
