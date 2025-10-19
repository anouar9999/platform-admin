import FloatingLabelInput from '@/app/components/input/input'
import { AlertCircle } from 'lucide-react'
import React from 'react'
import { Controller } from 'react-hook-form'

const GameSelectionTransition = ({ control, errors, watch }) => {
  return (
        <div className="space-y-8">
            <div className="* space-x-3 mb-16">
              <h3 className="text-3xl text-white  font-custom tracking-wider">
                {' '}
                let's start with Basic Information
              </h3>
              <p className="text-gray-400 text-sm">
                Choisissez un nom accrocheur pour votre tournoi
              </p>
            </div>

            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Le nom du tournoi est requis',
                minLength: { value: 3, message: 'Le nom doit contenir au moins 3 caractères' },
              }}
              render={({ field }) => (
                <div>
                  <FloatingLabelInput
                    {...field}
                    type="text"
                    label="Nom du Tournoi"
                    className={`w-full bg-gray-800 text-white rounded-xl px-6 py-4 text-lg
                        focus:outline-none focus:ring-2 transition-all duration-300
                        ${
                          errors.name
                            ? 'focus:ring-red-500 border border-red-500'
                            : 'focus:ring-blue-500'
                        }`}
                    placeholder="Entrez le nom de votre tournoi"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
  )
}

export default GameSelectionTransition