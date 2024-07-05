// parser.rs

use crate::lexer::{Lexer, Token};
use crate::semantic_analyzer::SemanticAnalyzer;


// Abstract Syntax Tree (AST) for eTamil
#[derive(Debug)]
pub enum Expr {
    Number(i64),           // Integer literal
    VariableDeclaration,   // Variable declaration
    PrintStatement(String),// Print statement
    BinaryOp(Box<Expr>, Token, Box<Expr>),  // Binary operation (+, -, *, /)
}

// Parser struct
pub struct Parser<'a> {
    lexer: Lexer<'a>,
    current_token: Token,
}

impl<'a> Parser<'a> {
    // Create a new parser instance
    pub fn new(lexer: Lexer<'a>) -> Self {
        let current_token = lexer.next_token();
        Parser {
            lexer,
            current_token,
        }
    }
    
    // Advance to the next token
    fn eat(&mut self, expected_token: Token) {
        if self.current_token == expected_token {
            self.current_token = self.lexer.next_token();
        } else {
            panic!("Expected token {:?}, found {:?}", expected_token, self.current_token);
        }
    }
    
    // Parse a primary expression (number or variable)
    fn parse_primary(&mut self) -> Expr {
        match self.current_token {
            Token::IntegerLiteral(value) => {
                self.eat(Token::IntegerLiteral(value));
                Expr::Number(value)
            }
            Token::T_en => {
                self.eat(Token::T_en);
                Expr::VariableDeclaration
            }
            Token::T_itu => {
                self.eat(Token::T_itu);
                // Parse print statement arguments, here assumed to be a string literal
                if let Token::Identifier(arg) = self.current_token {
                    self.eat(Token::Identifier(arg.clone()));
                    Expr::PrintStatement(arg)
                } else {
                    panic!("Expected identifier for print statement argument");
                }
            }
            _ => panic!("Unexpected token {:?}", self.current_token),
        }
    }
    
    // Parse a multiplicative expression (*, /)
    fn parse_multiplicative(&mut self) -> Expr {
        let mut expr = self.parse_primary();
        
        while let Token::Multiply | Token::Divide = self.current_token {
            let op = self.current_token.clone();
            self.eat(op.clone());
            let right = self.parse_primary();
            expr = Expr::BinaryOp(Box::new(expr), op, Box::new(right));
        }
        
        expr
    }
    
    // Parse an additive expression (+, -)
    fn parse_additive(&mut self) -> Expr {
        let mut expr = self.parse_multiplicative();
        
        while let Token::Plus | Token::Minus = self.current_token {
            let op = self.current_token.clone();
            self.eat(op.clone());
            let right = self.parse_multiplicative();
            expr = Expr::BinaryOp(Box::new(expr), op, Box::new(right));
        }
        
        expr
    }
    
    // Parse the entire expression and perform semantic analysis
    pub fn parse(&mut self) -> Expr {
        let mut expr = self.parse_expression();
        // Perform semantic analysis
        let mut analyzer = SemanticAnalyzer::new();
        analyzer.analyze(&mut expr);
        expr
    }
    
}
