#!/bin/bash

# use-megamind Development Script
# Simple script to run the complete testing environment

set -e

echo "🧠 use-megamind Development Environment"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    print_error "Yarn is not installed. Please install Yarn first."
    exit 1
fi

# Function to setup dependencies
setup() {
    print_step "Installing all dependencies..."
    yarn setup
    print_success "Dependencies installed successfully!"
}

# Function to build the library
build() {
    print_step "Building the use-megamind library..."
    yarn build
    print_success "Library built successfully!"
}

# Function to start examples
start_examples() {
    print_step "Starting examples (Server + Client)..."
    echo ""
    print_warning "This will start both:"
    echo "  📡 Test Server on http://localhost:15001"
    echo "  🌐 React App on http://localhost:15002"
    echo ""
    print_step "Killing any existing processes on ports 15001 and 15002..."
    kill-port 15001 2>/dev/null || true
    kill-port 15002 2>/dev/null || true
    echo ""
    echo "Press Ctrl+C to stop both services"
    echo ""
    yarn examples
}

# Function to clean everything
clean() {
    print_step "Cleaning all build files and dependencies..."
    yarn clean
    print_success "Cleaned successfully!"
}

# Function to reset everything
reset() {
    print_step "Resetting entire project..."
    yarn reset
    print_success "Reset complete!"
}

# Parse command line arguments
case "${1:-start}" in
    "setup")
        setup
        ;;
    "build")
        build
        ;;
    "start"|"dev")
        build
        start_examples
        ;;
    "examples")
        start_examples
        ;;
    "server")
        print_step "Starting only the test server..."
        print_step "Killing any existing process on port 15001..."
        kill-port 15001 2>/dev/null || true
        yarn server
        ;;
    "client")
        print_step "Starting only the React client..."
        print_step "Killing any existing process on port 15002..."
        kill-port 15002 2>/dev/null || true
        yarn client
        ;;
    "clean")
        clean
        ;;
    "reset")
        reset
        ;;
    "help"|"-h"|"--help")
        echo ""
        echo "📖 Available commands:"
        echo ""
        echo "  🚀 ./run.sh [start|dev]  - Build library and start both server + client (default)"
        echo "  📦 ./run.sh setup        - Install all dependencies"
        echo "  🔨 ./run.sh build        - Build the use-megamind library only"
        echo "  🌐 ./run.sh examples     - Start examples without building"
        echo "  📡 ./run.sh server       - Start only the test server (port 15001)"
        echo "  💻 ./run.sh client       - Start only the React client (port 15002)"
        echo "  🧹 ./run.sh clean        - Clean all build files and dependencies"
        echo "  ♻️  ./run.sh reset        - Reset everything (clean + setup)"
        echo "  📖 ./run.sh help         - Show this help message"
        echo ""
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Run './run.sh help' to see available commands"
        exit 1
        ;;
esac