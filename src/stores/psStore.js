import { writable } from 'svelte/store';
import { supabase } from "../supabase.js";
import { success, failure, warn, loading } from './buttonStore';
import { toast } from '@zerodevx/svelte-toast';
import { sleep } from './generalStore'
export const quizScores = writable([]);

export const chooseATeam = async (team) => {
    try {
        let { data: selectTeam, errorSelectTeam } = await supabase
            .from('ps')
            .select('team')
            .ilike('team', `%${team}%`)
        if (selectTeam.length === 0) {
            const { data, error } = await supabase.from('ps').insert([{ team: team }]);
        }
        //else don't
        success('Drużyna zapisana!', 10000);
    } catch (error) {
        failure(error, 10000)
    }
}

export const answerQuestion = async (team, answer, misc) => {
    if (!answer) {
        failure('Wprowadź odpowiedź', 10000);
        return;
    }
    loading('Wysyłanie odpowiedzi...');
    try {
        let { data: canAnswer, error } = await supabase
            .from('ps')
            .select('canAnswer, isTakeover')
            .eq('team', team);
        let { data: quizData, error: quizError } = await supabase
            .from('ps')
            .select('answer')
            .eq('team', team)
            .is('answer', null);
        if (!quizData[0]) {
            toast.pop();
            await sleep(500);
            failure('Już podałeś odpowiedź', 10000);
            return;
        }

        if (canAnswer[0].canAnswer === false) {
            toast.pop();
            await sleep(500);
            failure('Czas na odpowiedź na to pytanie dobiegł końca', 10000);
            return;
        }

        if (canAnswer[0].isTakeover !== 'X') {
            toast.pop();
            await sleep(500);
            warn('Odpowiedź na nie swoje pytanie jest równoznaczna z przejęciem go', 10000);
            const { data: dbdata, error: dberror } = await supabase
                .from('ps')
                .update([{ isTakeover: 'X', takeoverDate: Date.now() }])
                .eq('team', team);
        }

        const { data: dbdata, error: dberror } = await supabase
            .from('ps')
            .update([{ answer: answer, misc: misc }])
            .eq('team', team);

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const { data: answerReceived, error: answerReceivedError } = await supabase
            .from('psEvents')
            .insert([{ name: 'AnswerReceived', event: `"[${time}] ${team}" Przeslał odpowiedź "${answer}", "${misc}"`, }]);
        if (canAnswer[0].isTakeover === 'X') {
            toast.pop();
        }
        await sleep(500);
        success('Odpowiedź wysłana!', 10000);
    } catch (error) {
        toast.pop();
        failure(error, 10000);
    }
};

export const takeover = async (team) => {
    loading('Przejmowanie pytania...');
    try {
        let { data: canAnswer, error } = await supabase
            .from('ps')
            .select('canAnswer, isTurn')
            .eq('team', team);
        let { data: quizData, error: quizError } = await supabase
            .from('ps')
            .select('isTakeover')
            .eq('team', team)
            .is('isTakeover', null);

        if (quizData.length === 0) {
            toast.pop();
            await sleep(500);
            failure('Już przejąłeś to pytanie!', 10000);
            return;
        }

        if (canAnswer[0].canAnswer === false) {
            toast.pop();
            await sleep(500);
            failure('Czas przejęcie tego pytania dobiegł końca', 10000);
            return;
        }
        if (canAnswer[0].isTurn === 'X') {
            toast.pop();
            await sleep(500);
            failure('Nie możesz przejmować własnego pytania', 10000);
            return;
        }

        const { data: dbdata, error: dberror } = await supabase
            .from('ps')
            .update([{ isTakeover: 'X', takeoverDate: Date.now() }])
            .eq('team', team);

        toast.pop();
        await sleep(500);
        success('Przejęto pytanie!', 10000);
    } catch (error) {
        toast.pop();
        failure(error, 10000);
    }
}

export const renderTurn = async () => {
    let showTurn = [];
    let { data: initialData, error } = await supabase
        .from('ps')
        .select('team, isTurn, id')
        .order('id', { ascending: true });
    for (let i = 0; i < initialData.length; i++) {
        showTurn.push({ team: initialData[i].team, isTurn: initialData[i].isTurn });
    }
    return showTurn;
};

export const chooseTime = async (time, team) => {
    const { data: dbdata, error: dberror } = await supabase
        .from('ps')
        .update([{ seconds: time, timeChosen: true }])
        .eq('team', team);
};

export const loadQuizScores = async () => {
    const { data, error } = await supabase.from('ps')
        .select('*')
        .order('id', { ascending: true });
    if (error) {
        return console.error(error);
    }
    quizScores.set(data);
}

export const deleteAnswer = async (team) => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { data: dbdata, error: dberror } = await supabase
        .from('ps')
        .update([{ answer: null, misc: null }])
        .eq('team', team);

    const { data, error } = await supabase
        .from('psEvents')
        .insert([{ name: 'AnswerDeleted', event: `[${time}] 🗑️ Usunięto odpowiedź drużyny "${team}"`, }]);
    window.location.reload();
}

export const newRound = async () => {
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    const { data: roundNumberData, error: roundNumberErr } = await supabase
        .from('ps')
        .select('roundNumber, id, team')
        .order('id', { ascending: true });
    let round = roundNumberData

    if (round[0].roundNumber > roundNumberData.length - 1) {
        round[0].roundNumber = 0;
    }

    round[0].roundNumber++
    const { data: dbdata, error: dberror } = await supabase
        .from('ps')
        .update([{ answer: null, misc: null, canAnswer: true, isTurn: null, isTakeover: null, seconds: null, takeoverDate: null, timeChosen: false, roundNumber: round[0].roundNumber }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data: isTurnData, error: isTurnErr } = await supabase
        .from('ps')
        .update([{ isTurn: 'X' }])
        .eq('team', round[round[0].roundNumber - 1].team)

    const { data, error } = await supabase
        .from('psEvents')
        .insert([{ name: 'NewRound', event: `[${time}] ▂︎ ▃︎ ▄︎ ROZPOCZĘTO NOWĄ RUNDĘ ▄︎ ▃︎ ▂︎`, }]);
    window.location.reload()
}

export const disableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('ps')
        .update([{ canAnswer: false }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('psEvents')
        .insert([{ name: 'AnswersDisabled', event: `[${time}] ❌ Wyłączono zgłaszanie odpowiedzi`, }]);
}

export const enableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('ps')
        .update([{ canAnswer: true }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('psEvents')
        .insert([{ name: 'AnswersEnabled', event: `[${time}] ✔️ Włączono zgłaszanie odpowiedzi`, }]);
}
