import { errors, validators } from 'com'
import extractSubFromToken from '../utils/extractSubFromToken'

const { LengthError, NotFoundError, UnexpectedError, ConflictError } = errors
const { stringValidator, languagesValidator, ofStudyValidator, ofExperienceValidator, knowledgeValidator, booleanValidator } = validators

function updateOffer(token, offerId, offerUserId, { title, description, photo, languages, studies, experiences, knowledges, published } = {}) {
    stringValidator(token, 'token')
    stringValidator(offerId, 'offerId')
    stringValidator(offerUserId, 'offerUserId')

    if (title) stringValidator(title, 'title')
    if (description) stringValidator(description, 'description')
    if (photo) stringValidator(photo, 'photo')
    if (languages) languagesValidator(languages)
    if (studies) ofStudyValidator(studies)
    if (experiences) ofExperienceValidator(experiences)
    if (knowledges) knowledgeValidator(knowledges)
    if (typeof published === 'boolean') booleanValidator(published, 'published')

    const userId = extractSubFromToken(token)

    if (offerUserId !== userId) throw new Error('userId is different than offerUserId')

    const body = {}

    if (title) body.title = title
    if (description) body.description = description
    if (photo) body.photo = photo
    if (languages) body.languages = languages
    if (studies) body.studies = studies
    if (experiences) body.experiences = experiences
    if (knowledges) body.knowledges = knowledges
    if (typeof published === 'boolean') body.published = published

    return fetch(`http://localhost:80/offers/${offerId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 202) return

            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })
            } else if (res.status === 404) {
                return res.json()
                    .then(error => {
                        throw new NotFoundError(error.error)
                    })
            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error.message)
                    })
            } else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default updateOffer