import auth from './auth';
import events from './events';
import backInfo from './backInfo';
import user from './user';
  
export default{
    ...auth,
    ...events,
    ...backInfo,
    ...user
}
