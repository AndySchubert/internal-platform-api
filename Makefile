.PHONY: all install start stop clean test build lint format

all: install start

install:
	$(MAKE) -C backend install
	$(MAKE) -C frontend install

start: stop
	@echo "Starting backend and frontend... Press Ctrl+C to stop."
	$(MAKE) -C backend start & $(MAKE) -C frontend start; wait

stop:
	@echo "Stopping any existing processes on ports 8000 and 4200..."
	-fuser -k 8000/tcp 4200/tcp 2>/dev/null || true

clean: stop
	@echo "Cleaning up database and caches..."
	rm -f backend/envctl.db
	rm -rf frontend/dist
	rm -rf frontend/.angular/cache



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
