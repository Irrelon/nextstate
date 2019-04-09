const mapToStateData = (obj, overrides = {}, debugLog) => {
	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = overrides[key] || obj[key].value();
		obj[key].debugLog(`(mapToStateData) Mapping "${key}" to value ${JSON.stringify(acc[key])}`);
		
		return acc;
	}, {});
};

const getDisplayName = (WrappedComponent) => {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export {
	mapToStateData,
	getDisplayName
};