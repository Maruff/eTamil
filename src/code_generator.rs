// code_generator.rs

use crate::parser::Expr;
use inkwell::context::Context;
use inkwell::builder::Builder;
use inkwell::module::Module;
use inkwell::values::{FunctionValue, BasicValueEnum};
use inkwell::types::BasicTypeEnum;
use inkwell::targets::{Target, InitializationConfig};
use inkwell::execution_engine::{ExecutionEngine, JitFunction};

pub struct CodeGenerator {
    context: Context,
    module: Module,
    builder: Builder,
}

impl CodeGenerator {
    pub fn new(module_name: &str) -> Self {
        let context = Context::create();
        let module = context.create_module(module_name);
        let builder = context.create_builder();
        
        CodeGenerator {
            context,
            module,
            builder,
        }
    }
    
    pub fn generate_code(&mut self, ast: &Expr) {
        // Define main function
        let function = self.define_main_function();
        
        // Generate code for expressions
        self.generate_expression(ast, &function);
        
        // Print LLVM IR for debugging
        self.module.print_to_stderr();
        
        // Optimize and execute if needed
        self.optimize_and_execute();
    }
    
    fn define_main_function(&self) -> FunctionValue {
        let i64_type = self.context.i64_type();
        let function_type = i64_type.fn_type(&[], false);
        self.module.add_function("main", function_type, None)
    }
    
    fn generate_expression(&mut self, expr: &Expr, function: &FunctionValue) -> BasicValueEnum {
        match expr {
            Expr::Number(num) => {
                self.context.i64_type().const_int(*num as u64, false).as_basic_value_enum()
            }
            // Implement other cases for variable declarations, print statements, etc.
            _ => panic!("Unsupported expression type for code generation"),
        }
    }
    
    fn optimize_and_execute(&self) {
        // Add optimization passes if needed
        // Example:
        // let pass_manager = inkwell::passes::PassManager::create();
        // pass_manager.add_promote_memory_to_register_pass();
        // pass_manager.run_on(&self.module);
        
        // Initialize LLVM targets and execution engine
        Target::initialize_native(&InitializationConfig::default()).unwrap();
        let execution_engine = self.module.create_jit_execution_engine(inkwell::OptimizationLevel::None).unwrap();
        
        // Execute the main function
        let main_function: JitFunction<()> = unsafe { execution_engine.get_function("main").unwrap() };
        let result = main_function.call().unwrap();
        println!("Result: {}", result);
    }
}
