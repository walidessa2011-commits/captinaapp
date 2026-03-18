/**
 * Utility for WebAuthn (FaceID / Fingerprint / Passkeys)
 * This is a simplified version for demonstration and "Smart" linking as requested.
 */

export const isBiometricAvailable = async () => {
    return (
        window.PublicKeyCredential &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
};

export const registerBiometrics = async (userId, userEmail) => {
    if (!await isBiometricAvailable()) {
        throw new Error("Biometrics not available on this device");
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
            name: "Captina App",
            id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
        },
        user: {
            id: Uint8Array.from(userId, c => c.charCodeAt(0)),
            name: userEmail,
            displayName: userEmail,
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "preferred",
        },
        timeout: 60000,
        attestation: "none",
    };

    const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
    });

    // We store the rawId and public key (simplified) to Firestore
    return {
        credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        type: credential.type,
    };
};

export const authenticateBiometrics = async (storedCredentialId) => {
    if (!await isBiometricAvailable()) {
        throw new Error("Biometrics not available");
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const credentialIdArray = Uint8Array.from(atob(storedCredentialId), c => c.charCodeAt(0));

    const publicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [{
            id: credentialIdArray,
            type: 'public-key',
        }],
        userVerification: "required",
        timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
    });

    return assertion;
};
