// lexer.rs

use std::str::Chars;
use std::iter::Peekable;

// Define token types for eTamil
#[derive(Debug, PartialEq)]
pub enum Token {
    // Keywords
    T_itu,   // "itu" keyword for print statement
    T_en,    // "en" keyword for integer variable declaration
    
    // Operators
    Plus,
    Minus,
    Multiply,
    Divide,
    
    // Identifiers and literals
    Identifier(String),
    IntegerLiteral(i64),
    
    // End of file
    EOF,
    
    // Error token
    Error(String),
}

// Lexer struct to tokenize input
pub struct Lexer<'a> {
    input: Peekable<Chars<'a>>,
    current_char: Option<char>,
}

impl<'a> Lexer<'a> {
    // Create a new lexer instance
    pub fn new(input: &'a str) -> Self {
        let mut chars = input.chars().peekable();
        let current_char = chars.next();
        Lexer {
            input: chars,
            current_char,
        }
    }
    
    // Advance to the next character in input
    fn advance(&mut self) {
        self.current_char = self.input.next();
    }
    
    // Skip whitespace characters
    fn skip_whitespace(&mut self) {
        while let Some(&c) = self.current_char {
            if c.is_whitespace() {
                self.advance();
            } else {
                break;
            }
        }
    }
    
    // Parse an identifier or keyword
    fn parse_identifier(&mut self) -> String {
        let mut identifier = String::new();
        while let Some(&c) = self.current_char {
            if c.is_alphanumeric() || c == '_' {
                identifier.push(c);
                self.advance();
            } else {
                break;
            }
        }
        identifier
    }
    
    // Parse an integer literal
    fn parse_integer(&mut self) -> i64 {
        let mut number = String::new();
        while let Some(&c) = self.current_char {
            if c.is_digit(10) {
                number.push(c);
                self.advance();
            } else {
                break;
            }
        }
        number.parse().unwrap_or(0) // Return parsed integer or 0 if invalid
    }
    
    // Get the next token from input
    pub fn next_token(&mut self) -> Token {
        self.skip_whitespace();
        
        match self.current_char {
            Some('=') => {
                self.advance();
                Token::T_en  // "en" keyword for integer variable declaration
            }
            Some('+') => {
                self.advance();
                Token::Plus
            }
            Some('-') => {
                self.advance();
                Token::Minus
            }
            Some('*') => {
                self.advance();
                Token::Multiply
            }
            Some('/') => {
                self.advance();
                Token::Divide
            }
            Some('0'..='9') => Token::IntegerLiteral(self.parse_integer()),
            Some('a'..='z') | Some('A'..='Z') => {
                let identifier = self.parse_identifier();
                match identifier.as_str() {
                    "itu" => Token::T_itu,  // "itu" keyword for print statement
                    "en" => Token::T_en,    // "en" keyword for integer variable declaration
                    _ => Token::Identifier(identifier),
                }
            }
            Some(_) => {
                self.advance();
                Token::Error(String::from("Unexpected character"))
            }
            None => Token::EOF,
        }
    }
}
