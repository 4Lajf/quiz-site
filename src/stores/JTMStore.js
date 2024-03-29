import { refresh, sleep } from './generalStore';
import { success, failure, loading } from './buttonStore';
import { supabase } from '../supabase';
import { toast } from '@zerodevx/svelte-toast';
import { writable } from 'svelte/store';
export const quizScores = writable([]);

export const chooseATeam = async (team) => {
    try {
        let { data: selectTeam, errorSelectTeam } = await supabase
            .from('JTM')
            .select('team')
            .ilike('team', `%${team}%`)
        //console.log(selectTeam)
        if (selectTeam.length === 0) {
            const { data, error } = await supabase.from('JTM').insert([{ team: team }]);
        }
        //else don't
        success('Drużyna zapisana!', 5000);
    } catch (error) {
        failure(error, 10000)
    }
};

export const handleNotes = async (team, mode, notes) => {
    try {
        let { data: canAnswer, canAnswerError } = await supabase
            .from('JTM')
            .select('canAnswer')
            .eq('team', team);
        if (canAnswer[0].canAnswer === false) {
            toast.pop();
            await sleep(500);
            failure('Czas na odpowiedź na to pytanie dobiegł końca', 5000);
            return;
        }

        notes = parseInt(notes);
        if (isNaN(notes) || notes <= 0) {
            toast.pop();
            await sleep(500);
            failure('Podaj liczbę większą od 0', 5000);
            return;
        }

        let { data: noteFetch, error } = await supabase.from('JTM').select('notes');
        let noteFetchArr = [];
        for (let i = 0; i < noteFetch.length; i++) {
            noteFetchArr.push(noteFetch[i].notes);
        }
        noteFetchArr = noteFetchArr.sort();

        if (mode === 1) {
            notes = noteFetchArr[0] - 1;
            //(notes, noteFetchArr[0] - 1)
        }

        if (noteFetchArr[0] === 1 && noteFetchArr[1] === 1 && noteFetchArr[2] === 1) {
            await sleep(500);
            failure('Ta runda została zakończona');
            return;
        }

        loading('Wysyłanie odpowiedzi...');
        const { data: dbdata, error: dberror } = await supabase
            .from('JTM')
            .update([{ notes: notes, date: Date.now() }])
            .eq('team', team);
        renderNotes();
        await sleep(500);
        toast.pop();
        await sleep(500);
        success('Odpowiedź została wysłana!', 5000);
    } catch (error) {
        toast.pop();
        failure(error.message || error, 10000);
    }
};

export const renderNotes = async () => {
    let showNotes = [];
    let { data: initialData, error } = await supabase.from('JTM').select('notes, date, team');
    for (let i = 0; i < initialData.length; i++) {
        showNotes.push({ team: initialData[i].team, notes: initialData[i].notes, date: initialData[i].date });
    }

    showNotes = showNotes.sort((a, b) => {
        if (a.notes < b.notes) return -1;
        if (a.notes > b.notes) return 1;

        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;

    });
    return showNotes;
};

export const loadQuizScores = async () => {
    const { data, error } = await supabase.from('JTM')
        .select('*')
        .order('id', { ascending: true });
    if (error) {
        return console.error(error);
    }
    quizScores.set(data)
}

export const newRound = async () => {
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    const { data: dbdata, error: dberror } = await supabase
        .from('JTM')
        .update([{ notes: '9999', canAnswer: true }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('JTMEvents')
        .insert([{ name: 'NewRound', event: `[${time}] ▂︎ ▃︎ ▄︎ ROZPOCZĘTO NOWĄ RUNDĘ ▄︎ ▃︎ ▂︎`, }]);
    window.location.reload();
}

export const randomizeTeams = async () => {

    const { data: rtData, error: rtErr } = await supabase.from('JTM')
        .select('*');
    let teams = rtData;

    for (let i = 0; i < 10; i++) {
        const randomizeTeams = (array) => {
            const shuffledArray = array.sort((a, b) => 0.5 - Math.random());
            return shuffledArray
        }
        teams = randomizeTeams(teams)
    }
    const { data: delData, error: delErr } = await supabase
        .from('JTM')
        .delete()
        .or('canAnswer.eq.true,canAnswer.eq.false')

    for (let i = 0; i < teams.length; i++) {
        console.log(teams[i])
        const { data: insData, error: insErr } = await supabase
            .from('JTM')
            .insert([
                { canAnswer: teams[i].canAnswer, date: teams[i].date, notes: teams[i].notes, points: teams[i].points, team: teams[i].team },
            ])
    }
    refresh()
}

export const disableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('JTM')
        .update([{ canAnswer: false }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('JTMEvents')
        .insert([{ name: 'AnswersDisabled', event: `[${time}] ❌ Wyłączono zgłaszanie odpowiedzi`, }]);
}

export const enableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('JTM')
        .update([{ canAnswer: true }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('JTMEvents')
        .insert([{ name: 'AnswersEnabled', event: `[${time}] ✔️ Włączono zgłaszanie odpowiedzi`, }]);
}
