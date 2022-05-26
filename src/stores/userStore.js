import { sleep } from './generalStore';
import { success, failure, loading } from './buttonStore';
import { toast } from '@zerodevx/svelte-toast';
import { supabase } from '../supabase.js';
const user = supabase.auth.user()

export const updateBio = async (bio) => {

    try {
        loading('Updating your bio...');
        const { data, error } = await supabase
            .from('public_data')
            .update({ bio: bio })
            .eq('id', user.id)
        if (error)
            throw "An internal error has occured. Please try again later"
        await sleep(500);
        toast.pop();
        await sleep(500);
        success('Succesful bio update', 5000);
    } catch (error) {
        await sleep(500);
        toast.pop();
        await sleep(500);
        failure(error);
    }


};
//TODO:??????????????????????????????????????????????????
export const updateEmail = async (email, password) => {
    console.log('updating...')
    const { user, error } = await supabase.auth.update({ email: 'new@email.com' })
    console.log(user, error)
    console.log('done')
    /*     const { user, error } = await supabase.auth.update({
            data: { hello: 'niec' }
        })
        console.log(user, error) */
};

export const updatePassword = async (oldPassword, newPassword) => {
    try {
        loading('Updating your password...');
        let { data: dataPassword, error: queryErr } = await supabase
            .from('users')
            .select("encrypted_password")
            .eq('id', user.id)
        if (queryErr) {
            throw "An internal error has occured. Please try again later"
        }
        var bcrypt = dcodeIO.bcrypt;
        bcrypt.compare(oldPassword, dataPassword[0].encrypted_password, async (err, res) => {

            try {
                if (res === true) {
                    const { user, error: passwordError } = await supabase.auth.update({ password: newPassword })
                    if (passwordError) {
                        throw "An internal error has occured. Please try again later"
                    }
                    await sleep(500);
                    toast.pop();
                    await sleep(500);
                    success('Succesful password update', 5000);
                } else {
                    throw 'Wrong Password'
                }
            } catch (error) {
                if (error === 'Wrong Password') {
                    await sleep(500);
                    toast.pop();
                    await sleep(500);
                    failure(error, 5000);
                } else {
                    await sleep(500);
                    toast.pop();
                    await sleep(500);
                    failure(error, 5000);
                }
            }
        })
    } catch (error) {
        await sleep(500);
        toast.pop();
        await sleep(500);
        failure(error);
    }
};


