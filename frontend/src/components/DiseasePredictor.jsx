import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AI_API_BASE = 'http://localhost:8000';
const BACKEND_API = '/api/v1';

const ALL_SYMPTOMS = [
    'itching', 'skin rash', 'nodal skin eruptions', 'continuous sneezing', 'shivering',
    'chills', 'joint pain', 'stomach pain', 'acidity', 'ulcers on tongue',
    'muscle wasting', 'vomiting', 'burning micturition', 'fatigue', 'weight gain',
    'anxiety', 'cold hands and feet', 'mood swings', 'weight loss', 'restlessness',
    'lethargy', 'patches in throat', 'irregular sugar level', 'cough', 'high fever',
    'sunken eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion',
    'headache', 'yellowish skin', 'dark urine', 'nausea', 'loss of appetite',
    'pain behind the eyes', 'back pain', 'constipation', 'abdominal pain',
    'diarrhoea', 'mild fever', 'yellow urine', 'yellowing of eyes', 'acute liver failure',
    'fluid overload', 'swelling of stomach', 'swelled lymph nodes', 'malaise',
    'blurred and distorted vision', 'phlegm', 'throat irritation', 'redness of eyes',
    'sinus pressure', 'runny nose', 'congestion', 'chest pain', 'weakness in limbs',
    'fast heart rate', 'pain during bowel movements', 'neck pain', 'dizziness',
    'cramps', 'bruising', 'obesity', 'swollen legs', 'swollen blood vessels',
    'puffiness around eyes', 'enlarged thyroid', 'brittle nails', 'puffy face and eyes',
    'abnormal menstruation', 'dischromic patches', 'watering from eyes', 'loss of smell',
    'muscle weakness', 'stiff neck', 'depression', 'irritability', 'muscle pain',
    'altered sensorium', 'red spots over body', 'belly pain', 'hallucinations',
    'spinning movements', 'weakness of one body side', 'bladder discomfort',
    'continuous feel of urine', 'passage of gases', 'internal itching',
    'hip joint pain', 'lack of concentration', 'mucoid sputum', 'loss of balance',
];

// Mock logic removed - using live AI Service backend

export default function DiseasePredictor() {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [specialist, setSpecialist] = useState(null);
    const [predicting, setPredicting] = useState(false);
    const [focusedIdx, setFocusedIdx] = useState(-1);
    const [allSymptoms, setAllSymptoms] = useState(ALL_SYMPTOMS);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Fetch live symptoms on mount
    useEffect(() => {
        axios.get(`${AI_API_BASE}/symptoms`)
            .then(res => {
                if (res.data && res.data.symptoms) {
                    // Convert underscores back to spaces for nice UI display
                    const formattedSymptons = res.data.symptoms.map(s => s.replace(/_/g, ' '));
                    setAllSymptoms(formattedSymptons);
                }
            })
            .catch(err => {
                console.warn("AI Service not reachable, falling back to static list", err);
            });
    }, []);

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (q.length === 0) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        const filtered = allSymptoms
            .filter(s => s.includes(q) && !selected.includes(s))
            .slice(0, 8);
        setSuggestions(filtered);
        setShowDropdown(filtered.length > 0);
        setFocusedIdx(-1);
    }, [query, selected]);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const addSymptom = (symptom) => {
        if (!selected.includes(symptom)) {
            setSelected(prev => [...prev, symptom]);
        }
        setQuery('');
        setShowDropdown(false);
        setPrediction(null);
        inputRef.current?.focus();
    };

    const removeSymptom = (symptom) => {
        setSelected(prev => prev.filter(s => s !== symptom));
        setPrediction(null);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedIdx(i => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIdx(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && focusedIdx >= 0) {
            e.preventDefault();
            addSymptom(suggestions[focusedIdx]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const handlePredict = async () => {
        if (selected.length === 0) return;
        setPredicting(true);
        setPrediction(null);
        
        try {
            // Call the local FastAPI AI Service
            const response = await axios.post(`${AI_API_BASE}/predict`, {
                symptoms: selected
            });
            
            if (response.data && response.data.prediction) {
                const disease = response.data.prediction;
                const recSpecialist = response.data.recommended_specialist;
                setPrediction(disease);
                setSpecialist(recSpecialist);

                // Optional: Save to history if logged in
                const token = localStorage.getItem('cl_token');
                if (user && token) {
                    axios.post(`${BACKEND_API}/symptoms/logs`, {
                        symptoms: selected,
                        predictedDisease: disease
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    }).catch(e => console.error("Failed to save symptom log:", e));
                }
            } else {
                setPrediction("Analysis complete. Result inconclusive.");
            }
        } catch (err) {
            console.error("AI Service Error:", err);
            setPrediction("Unable to reach the diagnostic service. Please make sure the AI server is running.");
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div style={{
            background: 'rgba(15,40,25,0.7)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(207,249,113,0.25)',
            borderRadius: '24px',
            padding: '2rem',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(207,249,113,0.1)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CFF971" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>AI Symptom Checker</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Add your symptoms to get a prediction</div>
                </div>
            </div>

            {/* Search + Dropdown */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex', alignItems: 'center',
                    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(207,249,113,0.2)',
                    borderRadius: '14px', padding: '0 1rem', gap: '0.6rem',
                    transition: 'border-color 0.2s',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(207,249,113,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search symptoms (e.g. headache, fever…)"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.trim() && setShowDropdown(suggestions.length > 0)}
                        style={{
                            flex: 1, background: 'transparent', border: 'none', outline: 'none',
                            color: '#fff', fontSize: '0.92rem', padding: '0.85rem 0',
                            fontFamily: 'inherit',
                        }}
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setShowDropdown(false); }} style={{
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                            cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, padding: '2px',
                        }}>✕</button>
                    )}
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && (
                    <div ref={dropdownRef} style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                        background: 'rgba(10,30,20,0.97)', border: '1px solid rgba(207,249,113,0.25)',
                        borderRadius: '14px', 
                        overflowY: 'auto',  // Enable vertical scrolling
                        maxHeight: '280px', // Limit dropdown height
                        zIndex: 100,
                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(207,249,113,0.3) transparent'
                    }}>
                        {suggestions.map((s, idx) => (
                            <button
                                key={s}
                                onMouseDown={(e) => { e.preventDefault(); addSymptom(s); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    width: '100%', padding: '0.75rem 1.1rem', border: 'none',
                                    background: focusedIdx === idx ? 'rgba(207,249,113,0.12)' : 'transparent',
                                    color: focusedIdx === idx ? '#CFF971' : 'rgba(255,255,255,0.85)',
                                    cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem',
                                    transition: 'all 0.15s', fontFamily: 'inherit',
                                    borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(207,249,113,0.1)'; e.currentTarget.style.color = '#CFF971'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = focusedIdx === idx ? 'rgba(207,249,113,0.12)' : 'transparent'; e.currentTarget.style.color = focusedIdx === idx ? '#CFF971' : 'rgba(255,255,255,0.85)'; }}
                            >
                                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>＋</span>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Symptom Chips */}
            {selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selected.map(symptom => (
                        <div key={symptom} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            background: 'rgba(207,249,113,0.12)', border: '1px solid rgba(207,249,113,0.3)',
                            borderRadius: '100px', padding: '0.3rem 0.75rem 0.3rem 0.9rem',
                            color: '#CFF971', fontSize: '0.82rem', fontWeight: 600,
                            animation: 'chipIn 0.2s ease',
                        }}>
                            {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                            <button
                                onClick={() => removeSymptom(symptom)}
                                style={{
                                    background: 'rgba(207,249,113,0.15)', border: 'none',
                                    color: '#CFF971', cursor: 'pointer', width: '18px', height: '18px',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900,
                                    lineHeight: 1, padding: 0, flexShrink: 0, transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(207,249,113,0.35)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(207,249,113,0.15)'}
                            >✕</button>
                        </div>
                    ))}
                    <button
                        onClick={() => { setSelected([]); setPrediction(null); }}
                        style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '100px', padding: '0.3rem 0.75rem',
                            color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    >Clear all</button>
                </div>
            )}

            {/* Predict Button */}
            <button
                onClick={handlePredict}
                disabled={selected.length === 0 || predicting}
                style={{
                    width: '100%', padding: '0.95rem',
                    background: selected.length === 0 ? 'rgba(207,249,113,0.15)' : 'linear-gradient(135deg, #CFF971, #a8f04a)',
                    border: 'none', borderRadius: '14px', cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
                    color: selected.length === 0 ? 'rgba(207,249,113,0.4)' : '#0a2e0e',
                    fontSize: '1rem', fontWeight: 800, fontFamily: 'inherit',
                    transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    boxShadow: selected.length > 0 ? '0 4px 20px rgba(168,240,74,0.35)' : 'none',
                }}
                onMouseEnter={e => { if (selected.length > 0) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(168,240,74,0.5)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = selected.length > 0 ? '0 4px 20px rgba(168,240,74,0.35)' : 'none'; }}
            >
                {predicting ? (
                    <>
                        <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        Analysing Symptoms…
                    </>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        Predict Disease
                    </>
                )}
            </button>

            {/* Prediction Result */}
            {prediction && (
                <div style={{
                    marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    animation: 'chipIn 0.3s ease',
                }}>
                    {/* Condition Card */}
                    <div style={{
                        padding: '1.1rem 1.25rem',
                        background: 'rgba(207,249,113,0.08)', border: '1px solid rgba(207,249,113,0.3)',
                        borderRadius: '14px',
                    }}>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(207,249,113,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                            Possible Condition
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#CFF971' }}>{prediction}</div>
                        <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                            ⚠️ This is an AI-assisted estimate only. Please consult a qualified physician for an accurate diagnosis.
                        </div>
                    </div>

                    {/* specialist Recommendation Card */}
                    {specialist && (
                        <div style={{
                            padding: '1rem 1.25rem',
                            background: 'rgba(26,176,136,0.1)', border: '1px solid rgba(26,176,136,0.3)',
                            borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: 'rgba(26,176,136,0.2)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: '#1AB088'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/><path d="M10 2a2 2 0 1 0 4 0"/><path d="M16 2a2 2 0 1 0 4 0"/><path d="M12 4v10a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M18 4v10a3 3 0 0 0 3-3 3 3 0 0 0-3-3"/><path d="M12 14h6"/>
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.68rem', color: 'rgba(26,176,136,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Recommended Specialist
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1AB088' }}>{specialist}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes chipIn {
                    from { opacity: 0; transform: scale(0.85) translateY(4px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
