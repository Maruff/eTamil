// semantic_analyzer.rs

use crate::parser::{Expr, DataType};
use crate::symbol_table::{SymbolTable, SymbolEntry};

// Semantic analyzer for eTamil
pub struct SemanticAnalyzer {
    symbol_table: SymbolTable,
}

impl SemanticAnalyzer {
    // Create a new semantic analyzer with an empty symbol table
    pub fn new() -> Self {
        SemanticAnalyzer {
            symbol_table: SymbolTable::new(),
        }
    }
    
    // Perform semantic analysis on the AST
    pub fn analyze(&mut self, ast: &mut Expr) {
        self.visit_expr(ast);
    }
    
    // Visit each expression node in the AST
    fn visit_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::VariableDeclaration => {
                // Handle variable declarations
                // Example: `en = 123;`
                self.symbol_table.insert(String::from("en"), DataType::Integer);
            }
            Expr::PrintStatement(_) => {
                // Handle print statements
                // Example: `itu("Hello, world!");`
                // Check arguments, resolve identifiers, etc.
            }
            _ => {}, // Other expressions do not need semantic analysis in this example
        }
    }
}
