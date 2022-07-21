import { writable } from 'svelte/store';
import { supabase } from "../supabase.js";
import { success, failure, loading } from './buttonStore';
import { toast } from '@zerodevx/svelte-toast';
import { sleep } from './generalStore'
export const quizScores = writable([]);

export const chooseATeam = async (team) => {
    try {
        let { data: selectTeam, errorSelectTeam } = await supabase
            .from('quiz')
            .select('team')
            .ilike('team', `%${team}%`)
        if (selectTeam.length === 0) {
            const { data, error } = await supabase.from('quiz').insert([{ team: team }]);
        }
        //else don't
        success('Drużyna zapisana!', 5000);
    } catch (error) {
        failure(error, 10000)
    }
}

export const answerQuestion = async (team, answer, misc) => {
    if (!answer) {
        failure('Wprowadź odpowiedź', 5000);
        return;
    }
    loading('Wysyłanie odpowiedzi...');
    try {
        let { data: canAnswer, error } = await supabase
            .from('quiz')
            .select('canAnswer')
            .eq('team', team);
        if (canAnswer[0].canAnswer === false) {
            toast.pop();
            await sleep(500);
            failure('Czas na odpowiedź na to pytanie dobiegł końca', 5000);
            return;
        }
        let { data: quizData, error: quizError } = await supabase
            .from('quiz')
            .select('answer')
            .eq('team', team)
            .is('answer', null);
        if (!quizData[0]) {
            toast.pop();
            await sleep(500);
            failure('Już podałeś odpowiedź', 5000);
            return;
        }


        const { data: dbdata, error: dberror } = await supabase
            .from('quiz')
            .update([{ answer: answer, misc: misc }])
            .eq('team', team);

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const { data: answerReceived, error: answerReceivedError } = await supabase
            .from('quizEvents')
            .insert([{ name: 'AnswerReceived', event: `"[${time}] ${team}" Przeslał odpowiedź "${answer}", "${misc}"`, }]);
        toast.pop();
        await sleep(500);
        success('Answer submitted!', 5000);
    } catch (error) {
        toast.pop();
        failure(error, 10000);
    }
};

export const loadQuizScores = async () => {
    const { data, error } = await supabase.from('quiz')
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
        .from('quiz')
        .update([{ answer: null, misc: null }])
        .eq('team', team);

    const { data, error } = await supabase
        .from('quizEvents')
        .insert([{ name: 'AnswerDeleted', event: `[${time}] 🗑️ Usunięto odpowiedź drużyny "${team}"`, }]);
    window.location.reload();
}

export const newRound = async () => {
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    const { data: dbdata, error: dberror } = await supabase
        .from('quiz')
        .update([{ answer: null, misc: null, canAnswer: true }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('quizEvents')
        .insert([{ name: 'NewRound', event: `[${time}] ▂︎ ▃︎ ▄︎ ROZPOCZĘTO NOWĄ RUNDĘ ▄︎ ▃︎ ▂︎`, }]);
    window.location.reload();
}

export const disableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('quiz')
        .update([{ canAnswer: false }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('quizEvents')
        .insert([{ name: 'AnswersDisabled', event: `[${time}] ❌ Wyłączono zgłaszanie odpowiedzi`, }]);
}

export const enableAnswers = async () => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const { data: dbdata, error: dberror } = await supabase
        .from('quiz')
        .update([{ canAnswer: true }])
        .or('canAnswer.eq.true,canAnswer.eq.false')

    const { data, error } = await supabase
        .from('quizEvents')
        .insert([{ name: 'AnswersEnabled', event: `[${time}] ✔️ Włączono zgłaszanie odpowiedzi`, }]);
}
