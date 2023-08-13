import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import './consulta.css';
import { RiFileCopy2Line } from 'react-icons/ri';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cnpjValidator } from 'cnpj-validator';
import { BeatLoader } from 'react-spinners';

function Consulta() {
    const [cnpj, setCnpj] = useState(''); //12509168000106
    const [companyData, setCompanyData] = useState(null);
    const [showData, setShowData] = useState(false);
    const [showNewConsultation, setShowNewConsultation] = useState(false);
    const [remainingConsultations, setRemainingConsultations] = useState(3);
    const [timeUntilNextConsultation, setTimeUntilNextConsultation] = useState(0);
    const [loading, setLoading] = useState(false); // Novo estado para controlar o carregamento


    const handleCnpjChange = (event) => {
        const formattedCnpj = event.target.value.replace(/\D/g, '');
        setCnpj(formattedCnpj);
    };

    const handleCopyClick = (value) => {
        navigator.clipboard.writeText(value);
        toast.success('Conteúdo copiado com sucesso!');
    };


    const fetchCompanyData = async () => {
        setLoading(true); // Ativa o carregamento durante a consulta
        if (!cnpjValidator(cnpj)) {
            toast.error('CNPJ inválido! Verifique-o tente novamente.');
            return;
        }
        if (remainingConsultations === 0) {
            toast.error('Limite de consultas excedido. Aguarde o próximo minuto para fazer uma nova consulta.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/fetch-data/${cnpj}`);
            setCompanyData(response.data);
            setShowData(true);
            setRemainingConsultations(remainingConsultations - 1);
            setTimeUntilNextConsultation(60); // Tempo em segundos até a próxima consulta ser permitida
        } catch (error) {
            console.error('Error fetching company data:', error);
        }

        setLoading(false); // Desativa o carregamento após a conclusão da consulta
    };

    useEffect(() => {
        if (timeUntilNextConsultation > 0) {
            const timer = setInterval(() => {
                setTimeUntilNextConsultation(timeUntilNextConsultation - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (remainingConsultations === 0) {
            toast.info('Agora você pode fazer uma nova consulta.');
            setRemainingConsultations(3);
        }
    }, [timeUntilNextConsultation, remainingConsultations]);

    const handleNewConsultation = () => {
        setCnpj('');
        setShowData(false);
        setShowNewConsultation(false);
        setCompanyData(null);
    };

    return (
        <div className="Consulta">
            {loading ? (
                <div className="loading-container">
                    <BeatLoader color="#007bff" loading={true}/>
                </div>
            ) :  !showData ? (
                <>
                    <div className="input-container">
                        <h1>Consulta de CNPJ</h1>
                        <label htmlFor="cnpj">Digite o CNPJ:</label>
                        <InputMask
                            mask="99.999.999/9999-99"
                            id="cnpj"
                            value={cnpj}
                            onChange={handleCnpjChange}
                            className="input-mask"
                            style={{
                                /* width: '50%', */
                                padding: '0.5rem',
                                fontSize: '1rem',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        /><br />
                        <button onClick={fetchCompanyData}>Consultar</button>
                    </div>
                </>
            ) : (
                <div>
                    <div className='h1'>
                    <h1>Consulta de CNPJ</h1>
                    </div>
                    <div className="company-info">
                        <div className="column">
                            <div>
                                <label>NOM DA EMPRESA:</label>
                                <input type="text" readOnly value={companyData.nome} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.nome)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>FANTASIA:</label>
                                <input type="text" readOnly value={companyData.fantasia} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.fantasia)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>CNPJ:</label>
                                <input type="text" readOnly value={companyData.cnpj} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.cnpj)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>TIPO:</label>
                                <input type="text" readOnly value={companyData.tipo} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.tipo)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>PORTE:</label>
                                <input type="text" readOnly value={companyData.porte} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.porte)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>ABERTURA:</label>
                                <input type="text" readOnly value={companyData.abertura} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.abertura)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>ATIVIDADE PRINCIPAL:</label>
                                <input type="text" readOnly value={companyData.atividade_principal[0].text} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.atividade_principal[0].text)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>NATUREZA JURIDICA:</label>
                                <input type="text" readOnly value={companyData.natureza_juridica} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.natureza_juridica)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>LOGRADOURO:</label>
                                <input type="text" readOnly value={companyData.logradouro} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.logradouro)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                        </div>

                        <div className="column">
                            <div>
                                <label>NUMERO:</label>
                                <input type="text" readOnly value={companyData.numero} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.numero)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>COMPLEMENTO:</label>
                                <input type="text" readOnly value={companyData.complemento} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.complemento)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>CEP:</label>
                                <input type="text" readOnly value={companyData.cep} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.cep)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>BAIRRRO:</label>
                                <input type="text" readOnly value={companyData.bairro} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.bairro)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>MUNICIPIO:</label>
                                <input type="text" readOnly value={companyData.municipio} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.municipio)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>UF:</label>
                                <input type="text" readOnly value={companyData.uf} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.uf)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>EMAIL:</label>
                                <input type="text" readOnly value={companyData.email} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.email)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>TELEFONE:</label>
                                <input type="text" readOnly value={companyData.telefone} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.telefone)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                            <div>
                                <label>SOCIOS:</label>
                                <div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={companyData.qsa.map(socio => socio.nome).join(', ')}
                                    />
                                    <button className='copy' onClick={() => handleCopyClick(companyData.qsa.map(socio => socio.nome).join(', '))}>
                                        <RiFileCopy2Line />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label>CAPITAL SOCIAL:</label>
                                <input type="text" readOnly value={companyData.capital_social} />
                                <button className='copy' onClick={() => handleCopyClick(companyData.capital_social)}>
                                    <RiFileCopy2Line />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showData ? (
                <>
                    <div className="center-button-container">
                        <button className="center-button" onClick={handleNewConsultation}>Nova Consulta</button>
                    </div>
                </>
            ) : (
                <div className="timer-container">
                    {remainingConsultations === 0 && (
                        <p>Aguarde {timeUntilNextConsultation} segundos para fazer uma nova consulta</p>
                    )}
                    </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Consulta;

