import { writable } from 'svelte/store';
import { supabase } from '../supabase';
/* export let data = writable([
    {
        "AnswerReceived": `"Team1" Przeslał odpowiedź "Rick Roll"`,
    },
    {
        "PlusPoints": `"Team2" Otrzymał +1 punkt`,
    },
    {
        "MinusPoints": `"Team3" Stracił -1 punkt`,
    },
    {
        "AnswerDeleted": `Usunięto odpowiedź drużyny "Team4"`,
    },
    {
        "RoundStarted": `Rozpoczęto RUNDĘ X`,
    },
    {
        "AnswersEnabled": `Wyłączono zgłaszanie odpowiedzi`,
    },
    {
        "AnswersDisabled": `Włączono zgłaszanie odpowiedzi`,
    },
])
 */
export const renderEvents = async (table) => {
    let events = [];
    let { data: initialData, error } = await supabase.from(table).select('name, event');

    if (initialData.length === 0) {
        events.push({ default: 'Dziennik Zdarzeń zaczyna się tutaj' });
    }

    for (let i = 0; i < initialData.length; i++) {
        events.push({ [initialData[i].name]: initialData[i].event });
    }
    return events;
};