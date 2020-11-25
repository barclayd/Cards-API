import 'reflect-metadata';
require('dotenv-safe').config({
  allowEmptyValues: true,
});
import moduleAlias from 'module-alias';
if (process.env.NODE_ENV === 'production') {
  moduleAlias();
}
import { ServerService } from '@/services/ServerService';

(async () => {
  await new ServerService(process.env.PORT).start();
})();
