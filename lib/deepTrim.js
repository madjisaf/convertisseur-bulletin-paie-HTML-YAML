function deepTrim(object) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			switch (typeof object[key]) {
				case 'string':
					object[key] = object[key].replace(/\s+/g, ' ').trim();
					break;
				case 'object':
					object[key] = deepTrim(object[key]);
					break;
			}
		}
	}

	return object;
}

module.exports = deepTrim;
