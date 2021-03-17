import dev from './config.dev';
import prod from './config.prod';

export default process.env.NODE_ENV === 'development' ? dev : prod