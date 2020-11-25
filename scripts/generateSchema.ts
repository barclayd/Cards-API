import fs from 'fs';
import { printSchema } from 'graphql';
import { createSchema } from '@/schema';

(async () => {
  const sdl = printSchema(await createSchema());
  fs.writeFile(__dirname + '/../schema.graphql', sdl, () => {
    console.log('schema successfully printed');
    process.exit();
  });
})();
