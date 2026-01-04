'use client';

import { useState } from 'react';
import { addBankAccount, deleteBankAccount } from '@/actions/agency-actions';
import { TrashIcon, PlusIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountType: string | null;
    beneficiaryName: string | null;
}

export default function BankAccountsManager({ accounts }: { accounts: BankAccount[] }) {
    const [isAdding, setIsAdding] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleAdd = async (formData: FormData) => {
        setIsPending(true);
        try {
            await addBankAccount(formData);
            setIsAdding(false);
        } catch (error) {
            console.error(error);
            alert("Error al agregar cuenta");
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta cuenta?")) return;
        try {
            await deleteBankAccount(id);
        } catch (error) {
            console.error(error);
            alert("Error al eliminar cuenta");
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BanknotesIcon className="w-6 h-6 text-gray-500" />
                    Cuentas Bancarias
                </h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
                >
                    {isAdding ? "Cancelar" : "+ Agregar Cuenta"}
                </button>
            </div>

            {isAdding && (
                <form action={handleAdd} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Banco</label>
                            <input name="bankName" required placeholder="Banco Popular" className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Número de Cuenta</label>
                            <input name="accountNumber" required placeholder="000 000 000" className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tipo de Cuenta</label>
                            <select name="accountType" className="w-full p-2 border rounded-lg">
                                <option value="CORRIENTE">Corriente</option>
                                <option value="AHORROS">Ahorros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Beneficiario</label>
                            <input name="beneficiaryName" required placeholder="Nombre Titular" className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    <button disabled={isPending} className="w-full bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-50">
                        {isPending ? "Guardando..." : "Guardar Cuenta"}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {accounts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No hay cuentas configuradas.</div>
                ) : (
                    accounts.map(account => (
                        <div key={account.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                            <div>
                                <h3 className="font-bold text-gray-900">{account.bankName}</h3>
                                <p className="text-sm text-gray-500 font-mono">{account.accountNumber} • {account.accountType}</p>
                                <p className="text-xs text-gray-400 mt-1">{account.beneficiaryName}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(account.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
