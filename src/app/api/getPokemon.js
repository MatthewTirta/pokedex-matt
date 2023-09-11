import axios from 'axios';

const fetchData = async () => {
	try {
		const res = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=386');
		console.log(res);
		return res.data;
	} catch (err) {
		console.error('Error fetching data:', err);
		return null;
	}
};

export default fetchData;
