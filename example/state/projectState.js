import {State} from "../nextstate";

const projectState = new State("project", {
	"name": "My First Project",
	"items": [{
		"_id": "1",
		"label": "Item 1",
		"category": "1"
	}, {
		"_id": "2",
		"label": "Item 2",
		"category": "1"
	}, {
		"_id": "3",
		"label": "Item 3",
		"category": "2"
	}]
});

export default projectState;
