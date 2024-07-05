// src/bin/main.rs

mod lexer;
mod parser;
mod semantic_analyzer;
mod code_generator;
mod symbol_table;

use std::fs;

fn main() {
    // Read input file
    let filename = "examples/cAnRu_1.tml";
    let code = fs::read_to_string(filename).expect("Unable to read file");

    // Lexical analysis
    let lexer = lexer::Lexer::new(&code);

    // Parsing
    let mut parser = parser::Parser::new(lexer);
    let ast = parser.parse();

    // Semantic analysis
    let mut analyzer = semantic_analyzer::SemanticAnalyzer::new();
    analyzer.analyze(&ast);

    // Code generation
    let mut codegen = code_generator::CodeGenerator::new("eTamilModule");
    codegen.generate_code(&ast);
}
