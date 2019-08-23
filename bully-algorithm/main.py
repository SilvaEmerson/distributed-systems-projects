#! /usr/bin/python3
import sys


from Process import Process


if __name__ == "__main__":
    process_number = int(input("Type the number of processes\n> "))
    start_process = int(
        input("Type process number that will start the election\n> ")
    )
    all_process = [*map(Process, range(process_number))]

    for process in all_process:
        process.set_process_ids(all_process)

    for process in all_process:
        if process.id == start_process:
            process.start_election()
