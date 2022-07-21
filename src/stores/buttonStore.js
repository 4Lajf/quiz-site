import { toast } from '@zerodevx/svelte-toast'
import ToastTwoButtons from '../components/toasts/ToastTwoButtons.svelte'
import ToastSuccess from '../components/toasts/ToastSuccess.svelte'
import ToastWarn from '../components/toasts/ToastWarn.svelte'
import ToastLoading from '../components/toasts/ToastLoading.svelte'
import ToastFailure from '../components/toasts/ToastFailure.svelte'

export const success = (title, duration) => {
    toast.push({
        component: {
            src: ToastSuccess, // where `src` is a Svelte component
            props: {
                title: title,
                duration: duration,
            },
            sendIdTo: 'id' // send toast id to `id` prop
        },
        dismissable: false,
        initial: 0,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'rgba(0, 0, 0, 0)',
            '--toastBoxShadow': '0 0 0 0 rgba(0, 0, 0, 0.0)',
        }
    })
};

export const warn = (title, duration) => {
    toast.push({
        component: {
            src: ToastWarn, // where `src` is a Svelte component
            props: {
                title: title,
                duration: duration,
            },
            sendIdTo: 'id' // send toast id to `id` prop
        },
        dismissable: false,
        initial: 0,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'rgba(0, 0, 0, 0)',
            '--toastBoxShadow': '0 0 0 0 rgba(0, 0, 0, 0.0)',
        }
    })
};

export const twoButtons = (title, desc, destination, yesText, noText) => {
    toast.push({
        component: {
            src: ToastTwoButtons, // where `src` is a Svelte component
            props: {
                title: title,
                desc: desc,
                destination: destination,
                yesText: yesText,
                noText: noText,
            },
            sendIdTo: 'id' // send toast id to `toastId` prop
        },
        dismissable: false,
        initial: 0,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'rgba(0, 0, 0, 0)',
            '--toastBoxShadow': '0 0 0 0 rgba(0, 0, 0, 0.0)',
        }
    })
};

export const failure = (title, duration) => {
    toast.push({
        component: {
            src: ToastFailure, // where `src` is a Svelte component
            props: {
                title: title,
                duration: duration,
            },
            sendIdTo: 'id' // send toast id to `id` prop
        },
        dismissable: false,
        initial: 0,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'rgba(0, 0, 0, 0)',
            '--toastBoxShadow': '0 0 0 0 rgba(0, 0, 0, 0.0)',
        }
    })
};

export const loading = (title) => {
    toast.push({
        component: {
            src: ToastLoading, // where `src` is a Svelte component
            props: {
                title: title,
            },
            sendIdTo: 'id' // send toast id to `id` prop
        },
        dismissable: false,
        initial: 0,
        theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '0',
            '--toastBackground': 'rgba(0, 0, 0, 0)',
            '--toastBoxShadow': '0 0 0 0 rgba(0, 0, 0, 0.0)',
        }
    })
};

