import SubmoduleA from 'app/module-a/SubmoduleA';


class ModuleA extends SubmoduleA {

	doSomethingElse() {
		return super.doSomething();
	}

}

export default ModuleA;
