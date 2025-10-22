.PHONY: help verify-all install build typecheck lint test clean reports

SHELL := /bin/bash
WORKING_DIR := dynamic-api
NPM := npm

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)Mr. DJ v1 - Makefile Commands$(NC)"
	@echo "=============================="
	@echo "$(GREEN)make install$(NC)      - Install all dependencies"
	@echo "$(GREEN)make build$(NC)        - Build the application (fail-fast)"
	@echo "$(GREEN)make typecheck$(NC)    - Run TypeScript type checking (fail-fast)"
	@echo "$(GREEN)make lint$(NC)         - Run linting (fail-fast)"
	@echo "$(GREEN)make verify-all$(NC)   - Run all verification checks (typecheck, lint, build)"
	@echo "$(GREEN)make clean$(NC)        - Clean build artifacts"
	@echo "$(GREEN)make reports$(NC)      - Create reports directory structure"

install:
	@echo "$(BLUE)Installing dependencies...$(NC)"
	cd $(WORKING_DIR) && $(NPM) install
	@echo "$(GREEN)✓ Dependencies installed successfully$(NC)"

typecheck:
	@echo "$(BLUE)Running type check...$(NC)"
	cd $(WORKING_DIR) && $(NPM) run typecheck || (echo "$(RED)✗ Type check failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Type check passed$(NC)"

lint:
	@echo "$(BLUE)Running lint...$(NC)"
	cd $(WORKING_DIR) && $(NPM) run lint || (echo "$(RED)✗ Lint failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Lint passed$(NC)"

build:
	@echo "$(BLUE)Building application...$(NC)"
	cd $(WORKING_DIR) && $(NPM) run build || (echo "$(RED)✗ Build failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Build completed successfully$(NC)"

verify-all: reports
	@echo "$(YELLOW)========================================$(NC)"
	@echo "$(BLUE)Starting full verification pipeline...$(NC)"
	@echo "$(YELLOW)========================================$(NC)"
	@mkdir -p reports/batch-03
	@echo "$(BLUE)[1/3] Type checking...$(NC)"
	@$(MAKE) typecheck 2>&1 | tee -a reports/batch-03/verify_all.log || (echo "$(RED)✗ Verification failed at typecheck$(NC)" | tee -a reports/batch-03/verify_all.log && exit 1)
	@echo "$(BLUE)[2/3] Linting...$(NC)"
	@$(MAKE) lint 2>&1 | tee -a reports/batch-03/verify_all.log || (echo "$(RED)✗ Verification failed at lint$(NC)" | tee -a reports/batch-03/verify_all.log && exit 1)
	@echo "$(BLUE)[3/3] Building...$(NC)"
	@$(MAKE) build 2>&1 | tee -a reports/batch-03/verify_all.log || (echo "$(RED)✗ Verification failed at build$(NC)" | tee -a reports/batch-03/verify_all.log && exit 1)
	@echo "$(YELLOW)========================================$(NC)" | tee -a reports/batch-03/verify_all.log
	@echo "$(GREEN)✓ All verifications passed successfully!$(NC)" | tee -a reports/batch-03/verify_all.log
	@echo "$(YELLOW)========================================$(NC)" | tee -a reports/batch-03/verify_all.log
	@echo "$(BLUE)Logs saved to: reports/batch-03/verify_all.log$(NC)"

test:
	@echo "$(BLUE)Running tests...$(NC)"
	cd $(WORKING_DIR) && $(NPM) run test || (echo "$(RED)✗ Tests failed$(NC)" && exit 1)
	@echo "$(GREEN)✓ Tests passed$(NC)"

clean:
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	cd $(WORKING_DIR) && rm -rf .next node_modules/.cache
	@echo "$(GREEN)✓ Clean completed$(NC)"

reports:
	@mkdir -p reports/batch-03 reports/daily reports/weekly
	@echo "$(GREEN)✓ Reports directory structure created$(NC)"
