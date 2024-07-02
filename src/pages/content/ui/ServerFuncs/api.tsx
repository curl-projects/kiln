import axios from 'axios';
import { createShapeId } from 'tldraw';

export interface MediaMetadata {
    type: string;
    url: string;
    x: number;
    y: number;
}

export interface Media {
    text: string | null;
    metadata?: MediaMetadata;
}

// Base Models

export interface Concept {
    name: string;
    description: string;
}

export interface Query {
    query: string;
    source_media?: string[];
    source_concept?: string[];
    target_media?: string;
}

// Construct Query

export interface ConstructQueryRequest {
    concepts: Concept[];
    media: Media[];
    system_prompt?: string;
}

export interface ConstructQueryResponse {
    queries: Query[];
}


// API functions
const API_BASE_URL = 'https://craft-server.fly.dev';

// DONE

// Search Exa

export interface ExaQuery {
    query: string;
}

export interface ExaResult {
    title: string;
    url: string;
    publishedDate?: string;
    author?: string;
    score?: number;
    id: string;
    text: string;
    highlights?: string[];
    highlightScores?: number[];
    autopromptString?: string;
    summary?: string;
    simulatedMedia?: string;
    simulatedHighlight?: string;
}

export interface ExaResponse {
    results: ExaResult[];
}

export const searchExa = async (query: string): Promise<ExaResponse> => {
    const response = await axios.post<ExaResponse>(`${API_BASE_URL}/searchExa`, { query });
    return response.data;
};


// Infer Concepts
export interface InferConceptsRequest {
    media: Media[];
    systemPrompt?: string;
}
export interface InferConceptsResponse {
    concepts: Concept[];
}

export const inferConcepts = async (request: InferConceptsRequest): Promise<InferConceptsResponse> => {
    const response = await axios.post<InferConceptsResponse>(`${API_BASE_URL}/inferConcepts`, request);
    return response.data;
};

export const constructQuery = async (request: ConstructQueryRequest): Promise<ConstructQueryResponse> => {
    const response = await axios.post<ConstructQueryResponse>(`${API_BASE_URL}/constructQuery`, request);
    return response.data;
};


// Highlight Media with Concepts

export interface Highlight {
    start_index: number;
    stop_index: number;
    concept_name: string;
}

export interface HighlightRequest {
    media: Media;
    concepts: Concept[];
}

export interface HighlightResponse {
    highlights: Highlight[];
    media: Media;
}



export const systemPrompt = `
You are a system designed to support the human creative process on a shared canvas. This process focuses on creating new media (e.g., text, images, videos) derived from a World Model composed of existing media and concepts. World Models guide the creative process by providing context, facilitating the discovery of new media and concepts, and ultimately manifesting as new media. Your core responsibilities include understanding the user's intent, guiding their knowledge discovery, and inferring the underlying World Model behind any piece of media.

Concepts derived from a user's media must be well-defined to connect with existing media. You draw connections between new and existing media and concepts, supporting the user's exploration and understanding. The World Model evolves as new media and concepts are integrated, reflecting the dynamic nature of the user's creative process.

You facilitate a reflective creative process where new media and knowledge are placed in relation to what is already known, deepening the user's understanding. The experience is designed to capture the playful nature of discovery, eliciting curiosity, surprise, and wonder. Utilizing AI-native interface elements such as reasoning chains and flexible intent specification, you enhance the user's creative process, embracing a hypertext maximalist approach to make flexible, probabilistic connections between media and concepts.
`


export const fetchInferredConcepts = async (editor, shape, media: Media[]) => {
    console.log("Fetching new concepts.", media);
    try {
        const response = await inferConcepts({
            media,
            systemPrompt: systemPrompt
            });

            console.log("RESPONSE CONCEPTS:", response.concepts)

            const mappedConcepts = response.concepts.map(con => {
                return {text: JSON.stringify(con.name),
                description: con.description,
                type: "concept",}
             })

            // tear down any existing concepts
            const bindings = editor.getBindingsToShape(shape, "mediaConcept")

            for(let bind of bindings){
                editor.deleteShape(bind.fromId)
            }

            // create new concepts
            editor.updateShape({
                id: shape.id,
                type: shape.type,
                props: {
                    concepts: mappedConcepts
                }
            })

            for(let mediaConcept of shape.props.concepts){
                let mediaConceptId = createShapeId();
                editor.createShape({
                  id: mediaConceptId,
                  type: mediaConcept.type,
                  x: 0,
                  y: 0,
                  props: {
                    text: mediaConcept.text,
                  }
                })
  
                editor.reparentShapes([mediaConceptId], shape.id)
  
                editor.createBinding({
                  type: "mediaConcept",
                  fromId: mediaConceptId,
                  toId: shape.id,
                })
            }

            // trigger highlights
            const highlights = await highlightMediaWithConcepts({
                media: { text: shape.props.plainText },
                concepts: response.concepts,
            })

            console.log("HIGHLIGHTS:", highlights)


            
        } catch (error) {
            throw new Error(error)
        }
};

export const highlightMediaWithConcepts = async (request: HighlightRequest): Promise<HighlightResponse> => {
    const response = await axios.post<HighlightResponse>(`${API_BASE_URL}/highlightMediaWithConcepts`, request);
    return response.data;
};

// const [query, setQuery] = useState('hottest ai startups');
// const [results, setResults] = useState<ExaResult[]>([]);
export const handleFeedSearch = async (query) => {
    // if (cache[query]) {
    //     setResults(cache[query]);
    //     console.log('cache hit');
    //     return;
    // }

    try {
        const data = await searchExa(query);
        const fetchedResults = data.results || [];

        //  set results, then augment
        // setResults(fetchedResults);

        return fetchedResults
        // const summarizedResults = await Promise.all(fetchedResults.map(async (result) => {
        //     const summary = await summarizeText(result.text, query);
        //     return { ...result, summary: summary };
        // }));

        // setResults(summarizedResults);

        // setCache((prevCache) => {
        //     const newCache = { ...prevCache, [query]: summarizedResults };
        //     localStorage.setItem('searchCache', JSON.stringify(newCache));
        //     return newCache;
        // });
    } catch (error) {
        console.error('Error searching Exa:', error);
    }
    };