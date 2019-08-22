class Process:
    def __init__(self, id):
        self.id = id
        self.processes_ids = None
        self.is_master = False
        self.is_active = True

    def set_process_ids(self, processes_ids):
        self.processes_ids = [*filter(lambda id: id != self.id, processes_ids)]

    def start_election(self):
        print(f"Process {self.id} begin a election")
        greater_id = filter(
            lambda process: process.id > self.id, self.processes_ids
        )
        self.send_election_msg(greater_id)

    def send_election_msg(self, processes):
        answers = [
            *map(
                lambda process: {
                    "process": process,
                    "msg": process.get_election_msg(self),
                },
                processes,
            )
        ]
        ok_answers = [*filter(lambda answer: answer["msg"] == "OK", answers)]
        if ok_answers:
            next_process = min(
                ok_answers, key=lambda answer: answer["process"].id
            )
            next_process["process"].start_election()
        else:
            self.is_master = True
            print(f"Process {self.id} is a master")

    def get_election_msg(self, process):
        if process.id < self.id:
            return "OK"
        return None

    def __repr__(self):
        return f"P{self.id}[master={self.is_master}, active={self.is_active}]"
