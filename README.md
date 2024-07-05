
# eTamil Programming Language

**eTamil** is a domain-specific language (DSL) tailored for Indian accountants, auditors, and FinTech professionals. Designed to incorporate features specific to the Tamil language, it aims to promote coding literacy in the Tamil-speaking community by offering a programming syntax that resonates with the native language.

## Purpose

The purpose of eTamil is to be an Indian DSL for Accountants, Auditors, and FinTech Professionals. The development is in its preliminary stage. The special features required to build eCommerce, accounting, auditing, insurance, finance, and banking solutions will be added progressively.

## Features

- **Tamil Keywords**: Uses Tamil keywords for common programming constructs.
- **Simple Syntax**: Designed to be easy to read and write.
- **Mathematical Operators**: Supports basic mathematical operations.
- **Data Types**: Includes support for integers (`en`) and strings (`col`).
- **Printing**: Custom keyword `itu` for printing output.

### Keywords

- **itu (இடு)**: Pronounced as "idu", meaning "put".
- **peru (பெறு)**: Meaning "get".
- **en (எண்)**: Meaning "number".
- **col (சொல்)**: Pronounced as "sol", meaning "word".

## Getting Started

### Prerequisites

- **Rust**: Ensure that you have Rust installed on your system. You can download it from [rust-lang.org](https://www.rust-lang.org/).

### Installation

1. Clone the eTamil repository:
    ```sh
    git clone https://github.com/yourusername/eTamil.git
    cd eTamil
    ```

2. Build the project using Cargo:
    ```sh
    cargo build
    ```

3. Run the compiler:
    ```sh
    cargo run -- path/to/your/file.tml
    ```

### Writing Your First eTamil Program

Create a file named `example.tml` and add the following code:

```tml
en a = 10
en b = 20
itu a + b
col message = "வணக்கம், உலகம்!"
itu message
```

### Running Your Program

To run the program, use the following command:
```sh
cargo run -- example.tml
```

## Language Specification

### Keywords

- **itu (இடு)**: Pronounced as "idu", meaning "put".
- **peru (பெறு)**: Meaning "get".
- **en (எண்)**: Meaning "number".
- **col (சொல்)**: Pronounced as "sol", meaning "word".

### Data Types

- **Integers**: Defined using the `en` keyword.
- **Strings**: Defined using the `col` keyword.

### Operators

- **Addition**: `+`
- **Subtraction**: `-`
- **Multiplication**: `*`
- **Division**: `/`

## Contributing

We welcome contributions from the community for developing more features and documentation Tamil! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## Contact

For any questions or support, please contact:

- **Developer**: Esan Maruff
- **Email**: etamilindia@gmail.com

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

We hope you enjoy using eTamil! Your feedback and contributions are highly appreciated.
