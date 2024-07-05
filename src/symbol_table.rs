// symbol_table.rs

use std::collections::HashMap;

// Symbol table entry
#[derive(Debug)]
pub struct SymbolEntry {
    pub name: String,
    pub data_type: DataType,
    // Add more fields as needed
}

// Data types in eTamil
#[derive(Debug, PartialEq)]
pub enum DataType {
    Integer,
    String,
    // Add more types as needed
}

pub enum Expr {
    Number(i64),
    VariableDeclaration(String, Box<Expr>),
    PrintStatement(Box<Expr>),
    BinaryOp(Box<Expr>, Token, Box<Expr>),
}

// Symbol table for variable declarations
pub struct SymbolTable {
    symbols: HashMap<String, SymbolEntry>,
}

impl SymbolTable {
    // Create a new symbol table
    pub fn new() -> Self {
        SymbolTable {
            symbols: HashMap::new(),
        }
    }
    
    // Insert a symbol entry into the symbol table
    pub fn insert(&mut self, name: String, data_type: DataType) {
        let entry = SymbolEntry {
            name: name.clone(),
            data_type,
        };
        self.symbols.insert(name, entry);
    }
    
    // Lookup a symbol in the symbol table
    pub fn lookup(&self, name: &str) -> Option<&SymbolEntry> {
        self.symbols.get(name)
    }
}
// ast.rs

#[derive(Debug)]
