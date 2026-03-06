.PHONY: all install start test build lint format

all: install start

install:
	$(MAKE) -C backend install
	$(MAKE) -C frontend install

start:
	@echo "Starting backend and frontend... Press Ctrl+C to stop."
	$(MAKE) -C backend start & $(MAKE) -C frontend start; wait

test:
	$(MAKE) -C backend test
	$(MAKE) -C frontend test

build:
	$(MAKE) -C frontend build

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C frontend lint

format:
	$(MAKE) -C backend format
