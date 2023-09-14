'use client';
import React, { useState, useEffect } from 'react';
import { Input, Container } from 'reactstrap';

import fetchData from './api/getPokemon';
import './pokemonhome.css';

const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const typeColors = {
	fire: '#ff6849',
	water: '#59aeff',
	grass: '#93d776',
	poison: '#bc76ae',
	flying: '#85aeff',
	bug: '#bcc949',
	normal: '#c9c9bd',
	electric: '#ffd759',
	ground: '#e5c976',
	fairy: '#ffbdff',
	fighting: '#c97668',
	psychic: '#ff76ae',
	rock: '#c9bd85',
	steel: '#bcbdc9',
	ice: '#93e5ff',
	ghost: '#8585c9',
	dark: '#937668',
	dragon: '#9385f2',
};

const filterGen = (index) => {
	if (index <= 151) {
		return 'Gen 1';
	} else if (index <= 251) {
		return 'Gen 2';
	} else {
		return 'Gen 3';
	}
};

const Pokemon = ({ species, Index, types }) => {
	const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
		Index + 1
	}.png`;

	return (
		<div className="pokemon-box">
			<div className="pokemon-image">
				<img src={imageUrl} alt={species.name} />
			</div>
			<div className="pokemon-info">
				<p className="pokemon-id"># {Index + 1}</p>
				<p className="pokemon-name">{capitalize(species.name)}</p>
				<p className="pokemon-type">
					{types.map((type) => (
						<span
							key={type}
							style={{
								backgroundColor: typeColors[type],
								color: 'black',
								padding: '2px 5px',
								marginLeft: '5px',
								borderRadius: '5px',
								display: 'inline-block',
							}}
						>
							{capitalize(type)}
						</span>
					))}
				</p>
			</div>
		</div>
	);
};

const PokemonHome = () => {
	const [pokemon, setPokemon] = useState([]);
	const [search, setSearch] = useState('');
	const [Types, setTypes] = useState({});
	const [loading, setLoading] = useState(true);
	const [gen, setGen] = useState('ALL');

	useEffect(() => {
		fetchData().then((data) => {
			setPokemon(data.results);
			// FETCH DATA TYPE SEMUA POKEMON
			data.results.forEach(async (p, index) => {
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${p.name}`
				);
				const data = await response.json();
				const pokemonTypes = data.types.map((t) => t.type.name);
				setTypes((prevTypes) => ({
					...prevTypes,
					[p.name]: pokemonTypes,
				}));
			});

			setTimeout(() => {
				setLoading(false);
			}, 3000);
		});
	}, []);

	const filteredPokemon = pokemon.filter(
		(species) =>
			(gen === 'All' ||
				filterGen(
					pokemon.findIndex((poke) => poke.name === species.name) + 1
				) === gen) &&
			(species.name.includes(search.toLowerCase()) ||
				(Types[species.name] &&
					Types[species.name].some((type) =>
						type.includes(search.toLowerCase())
					)))
	);

	return (
		<Container>
			<div className="search-bar">
				<Input
					type="text"
					placeholder="Search Pokémon by name / type"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<div className="generation-filter">
				<select onChange={(e) => setGen(e.target.value)} value={gen}>
					<option value="All">All Gen</option>
					<option value="Gen 1">Generation 1</option>
					<option value="Gen 2">Generation 2</option>
					<option value="Gen 3">Generation 3</option>
				</select>
			</div>
			<h3>Pokémon:</h3>
			<div className="pokemon-grid">
				{loading ? (
					<h1>Loading...</h1>
				) : filteredPokemon.length > 0 ? (
					filteredPokemon.map((species) => {
						const Index = pokemon.findIndex(
							(poke) => poke.name === species.name
						);
						return (
							<Pokemon
								key={Index}
								species={species}
								Index={Index}
								types={Types[species.name] || []}
							/>
						);
					})
				) : (
					<h1>NOT FOUND!!!</h1>
				)}
			</div>
		</Container>
	);
};

const LiveCode = () => {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [gender, setGender] = useState('ALL');
	const [age, setAge] = useState('norm');

	useEffect(() => {
		const apiURL = 'https://dummyjson.com/users';
		fetch(apiURL)
			.then((data) => {
				data.json().then((data) => setUsers(data.users));
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const filterUser = users.filter(
		(user) =>
			(gender === 'ALL' || user.gender === gender) &&
			`${user.firstName} ${user.lastName}`
				.toLowerCase()
				.includes(search.toLowerCase())
	);

	const sortedUsers = filterUser.sort((a, b) => {
		if (age === 'asc') {
			return a.age - b.age;
		} else if (age === 'desc') {
			return b.age - a.age;
		} else {
			return 0;
		}
	});

	const listGender = (e) => {
		setGender(e.target.value);
	};

	const genderMask = (gender) => {
		if (gender === 'male') {
			return 'M';
		} else if (gender === 'female') {
			return 'F';
		}
	};

	const delUser = (userId) => {
		setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
	};

	return (
		<Container>
			<div>
				<h1>DATA</h1>
			</div>
			<div>
				<input
					type="text"
					placeholder="Search by Name"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select
					value={gender}
					onChange={listGender}
					style={{ marginLeft: '10px' }}
				>
					<option value="ALL">ALL</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
				<select
					value={age}
					onChange={(e) => setAge(e.target.value)}
					style={{ marginLeft: '10px' }}
				>
					<option value="norm">Sort Age</option>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>
			<table className="table">
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Photo</th>
						<th>Age</th>
						<th>Gender</th>
						<th>Company</th>
						<th>Title</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{sortedUsers.length > 0 ? (
						sortedUsers.map((user) => (
							<tr key={user.id} className="table-hover">
								<td>{user.id}</td>
								<td>
									{user.firstName} {user.lastName}
								</td>
								<td>PHOTO</td>
								<td>{user.age}</td>
								<td>{genderMask(user.gender)}</td>
								<td>{user.company.name}</td>
								<td>{user.company.title}</td>
								<td>
									<button onClick={() => delUser(user.id)}>X</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="8">NOT FOUND!!!</td>
						</tr>
					)}
				</tbody>
			</table>
		</Container>
	);
};

export default PokemonHome;
