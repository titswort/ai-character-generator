import React, { useState, useEffect } from 'react';
import { ApolloProvider as ApolloProvider2 } from '@apollo/react-components'; // I hate this, why do I have to do this to get around invariant 29?
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { query } from '../hooks/qltree';
import Layout from '../components/Layout'
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import {
	writeClass,
	writeRace,
	writeEquipment,
	writeBackground,
	writeSkills,
	writeAllClasses,
	writeAllRaces,
	writeAllBackgrounds,
	writeAllAlignments,
	writeAllSkills
} from '../redux/actions'

import {
	getClass,
	getRace
} from '../redux/selectors'
// import { X } from '../node_modules/@emotion-icons/octicons/index';
import { Action, FormDisplay, FlexColumn, FlexRow, ButtonDisplay } from '../styles/globals';
import Dropdown from '../components/Dropdown';
import SkillDropdown from '../components/SkillDropdown';
import AbilityScoreDisplay from '../components/AbilityScoreDisplay';

const ref = React.createRef();

function handleSubmitCleaner(userClassSelection) {
	var curatedChoice = userClassSelection.match(/Barbarian|Fighter|Bard|Cleric|Druid|Fighter|Monk|Paladin|Ranger|Rogue|Sorcerer|Wizard/); // returns ["FIRST STRING THAT SHOWS UP"]
	if (curatedChoice== null) return "Paladin";
	else return curatedChoice[0];
}

function handleSubmitCleanerRace(userRaceSelection){
	// allRaces= [Dwarf, Elf, Halfling, Human, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling]
	var curatedRacechoice = userRaceSelection.match(/Dwarf|Elf|Halfing|Human|Dragonborn|Gnome|Half-Elf|Half-Orc|Tiefling/); 
	if(curatedRacechoice==null) return "Dragonborn";
	else return curatedRacechoice[0];
}

function GeneralCharacter() {
	const [toggle, setToggle] = useState(false)
	const [spin, setSpin] = useState(false)
	const [userInput, setUserInput] = useState("")
	const { data, loading, error } = useQuery(query);
	const [allAbilityScores, setAllAbilityScores] = useState([])
	const [allSkills, setAllSkills] = useState([]);
	const [allLanguages, setAllLanguages] = useState([])
	const [allAlignments, setAllAlignments] = useState([]);
	const [allBackgrounds, setAllBackgrounds] = useState([]);
	const [allClasses, setAllClasses] = useState([]);
	const [allRaces, setAllRaces] = useState([]);
	const [allSpells, setAllSpells] = useState([])

	const dispatch = useDispatch()

	var testClass = [];
	var testClassProf = 0;

	useEffect(() => {
		if (loading === false) {
			console.log("--- LOADED DATA: ", data)
			console.log(Object.entries(data.abilityScores));
			setAllAbilityScores(Object.entries(data.abilityScores));
			setAllSkills(Object.entries(data.skills));
			setAllLanguages(Object.entries(data.languages));
			setAllAlignments(Object.entries(data.alignments));
			setAllBackgrounds(Object.entries(data.backgrounds));
			setAllClasses(Object.entries(data.classes));
			setAllRaces(Object.entries(data.races));
			setAllSpells(Object.entries(data.spells));
			// Storage
			dispatch(writeAllClasses(Object.entries(data.classes)))
			dispatch(writeAllRaces(Object.entries(data.races)))
			dispatch(writeAllBackgrounds(Object.entries(data.backgrounds)))
			dispatch(writeAllAlignments(Object.entries(data.alignments)))
			dispatch(writeAllSkills(Object.entries(data.skills)))
		}
		if (toggle === true) testClass = allClasses[2];
	}, [loading, error, toggle])

	// i think these are causing issues on the api call part of the project
	var currClass = useSelector(getClass)
	var currRace = useSelector(getRace)

	// openapi call stuff below up until return
	const [classInput, setclassInput] = useState("");   // same as user input
	const [result, setResult] = useState();
	const [resultTwo, setResultTwo] = useState();

	async function onSubmit(event) {
		setToggle(false)
		setSpin(true)
		console.log("before the preventDefault + event object")
		event.preventDefault();
		console.log(">>>>>>>>>>Fetching the data from the call>>>>>>>");
		const response = await fetch("/api/userClass", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userClass: classInput }),
		});
		const data = await response.json();
		
		// second call
		const responseTwo = await fetch("/api/userRace", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify({ userClass: classInput }),
		});
		const secondData= await responseTwo.json();
		setResult(data.result);
		setResultTwo(secondData.resultTwo);

		console.log("original return from open AI call 1>> " + data.result);
		console.log("original return from open AI call 2>> " + secondData.resultTwo);
		var setPickedResult = handleSubmitCleaner(data.result);
		console.log("This is the picked Class from the API after sanitazation>> " + setPickedResult);

		var setPickedRace = handleSubmitCleanerRace(secondData.resultTwo); 
		console.log("the picked race is "+setPickedRace);
		
		dispatch(writeClass(setPickedResult));
		dispatch(writeRace(setPickedRace));

		setclassInput("");

		setSpin(false)
		setToggle(true)
	}
	return (
		<Layout Title="Let's Get Started...">      
			<FormDisplay>
				<form onSubmit={onSubmit}>
					<input value={classInput} placeholder="Enter a description of your character" onChange={(e) => setclassInput(e.target.value)} />
					<button>Submit</button>
				</form>
				{spin ? <Spinner /> : <></>}
				{toggle ? <>
					<h1>Results: </h1>
					<FlexRow>
						<FlexColumn>
							<Dropdown data={allRaces} /*currValue={currRace}*//>
							<Dropdown data={allClasses} /*currValue={currClass}*//>
							<SkillDropdown classes={allClasses} />
						</FlexColumn>
						<FlexColumn>
							<AbilityScoreDisplay data={allAbilityScores}/>
						</FlexColumn>
					</FlexRow>
				</> : <></>}

			</FormDisplay>
			{toggle ?
				<ButtonDisplay>
					<Link href="/backstory">
						<Action>Continue</Action>
					</Link>	
				</ButtonDisplay>
			: <></>}
		</Layout>
	)
}

export default function Home() {
    const client = new ApolloClient({
        uri: "https://www.dnd5eapi.co/graphql", 
        cache: new InMemoryCache()
    });
    return (
        <ApolloProvider2 client={client}>
            <ApolloProvider client={client}>
                <GeneralCharacter/>
            </ApolloProvider>
        </ApolloProvider2>
    )
}