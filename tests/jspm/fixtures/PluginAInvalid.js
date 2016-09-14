import ModuleA from 'app/not-exists/module-a/ModuleA';
import ModuleB from 'app/module-b/ModuleB';


export default {
	moduleA: new ModuleA(),
	moduleB: new ModuleB()
};
