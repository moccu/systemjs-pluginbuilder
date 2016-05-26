import SubmoduleB from 'app/module-b/SubmoduleB';


class ModuleB extends SubmoduleB {

	doSomethingElse() {
		return super.doSomething();
	}

}

export default ModuleB;
