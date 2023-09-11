'use client';
import React, { useState, useEffect } from 'react';
import { Input, Container } from 'reactstrap';

import fetchData from './api/getPokemon';
import './pokemonhome.css';

const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
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
				<p className="pokemon-type">Type: {types.join(', ')}</p>
			</div>
		</div>
	);
};

const PokemonHome = () => {
	const [pokemon, setPokemon] = useState([]);
	const [search, setSearch] = useState('');
	const [Types, setTypes] = useState({});

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
		});
	}, []);

	const filteredPokemon = pokemon.filter((species) =>
		species.name.includes(search.toLowerCase())
	);

	return (
		<Container>
			<div className="search-bar">
				<Input
					type="text"
					placeholder="Search Pokémon by name"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<h3>Pokémon:</h3>
			<div className="pokemon-grid">
				{filteredPokemon.map((species) => {
					const Index = pokemon.findIndex((poke) => poke.name === species.name);
					return (
						<Pokemon
							key={Index}
							species={species}
							Index={Index}
							types={Types[species.name] || []}
						/>
					);
				})}
			</div>
		</Container>
	);
};

export default PokemonHome;
