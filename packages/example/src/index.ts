import { EXPORT_FROM_LIB1 } from '@armathai/lib1';
import { EXPORT_FROM_LIB2 } from '@armathai/lib2';

new (class {
    public constructor() {
        console.warn(EXPORT_FROM_LIB1);
        console.warn(EXPORT_FROM_LIB2);
    }
})();
