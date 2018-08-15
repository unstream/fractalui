import { writeFile } from 'fs';

const targetPath = `./src/environments/environment.ts`;
const envConfigFile = `
export const environment = {
  production: '${process.env.PRODUCTION}',
  fractalServiceUrl: '${process.env.FRACTAL_SERVICE_URL}'
};
`;

writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`Output generated at ${targetPath}`);
});
