import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DayPicker, getDefaultClassNames  } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { format } from "date-fns";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon, PencilIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import avatarDefault from '../../assets/avatarDefault.png'
import fabri from '../../assets/fabri.png'
//import classNames from "react-day-picker/style.module.css";
import { uploadImage } from "../../services/uploadService";


// Esquema de validação com Yup
const signUpSchema = yup.object({
  name: yup.string().min(3).max(50).required("O nome é obrigatório"),
  sobrenome: yup.string().min(3).max(50).required("O nome é obrigatório"),
  email: yup
    .string()
    .min(6)
    .max(60)
    .email("Digite um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(8)
    .required("A senha é obrigatória")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número"
    ),
  confirmPassword: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
  birthDate: yup.date().required("A data de nascimento é obrigatória"),
  photoUrl: yup.string().url().optional(),
});

type SignUpFormData = yup.InferType<typeof signUpSchema>;

export default function SignUpForm() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [compressedFile, setCompressedFile] = useState<File | null>(null); 
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmePassword, setShowConfirmePassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const defaultClassNames = getDefaultClassNames();
  
  const navigate = useNavigate();
  const { signup } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 200,
          useWebWorker: true,
        };
        const compressed = await imageCompression(file, options);
        setCompressedFile(compressed); // Apenas armazena a imagem comprimida

        const previewUrl = URL.createObjectURL(compressed); // 🔥 Cria uma URL temporária
        setPhotoUrl(previewUrl); // Atualiza o preview

        toast.success("Imagem processada com sucesso!", {position: 'bottom-right'});

      } catch(error) {
        toast.error(`Erro ao processar a imagem. ${error}`, {position: 'bottom-right'});
      }
    }
  };

  const handlePhotoUploadDefault = async (photo: any): Promise<File | null> => {
    if (photo) {
      try {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 200,
          useWebWorker: true,
        };
        const compressed = await imageCompression(photo, options);
      
        return compressed;
      } catch(error) {
        toast.error(`Erro ao processar a imagem. ${error}`, {position: 'bottom-right'});
        return null;
      }
    }
    return null;
  };

  
const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
};


  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (!birthDate) {
        toast.error("Selecione uma data de nascimento válida.", {position: 'bottom-right'});
        return;
      }
  
      setIsLoading(true);
  
      let uploadedImageUrl = avatarDefault; // Define a foto padrão
  
      if (compressedFile) {
        uploadedImageUrl = await uploadImage(compressedFile); // 🔥 Faz o upload agora!
      } else {
        const auxFile = await urlToFile(fabri, "fabri.jpg", "image/jpeg");
        const aux = await handlePhotoUploadDefault(auxFile);
        uploadedImageUrl = await uploadImage(aux as File);
      }

      const nomeCompleto = `${data.name.trim()} ${data.sobrenome.trim()}`.trim();
  
      const formattedBirthDate = format(birthDate, "dd/MM/yyyy");


      const payload = {
        name: nomeCompleto,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        birthDate: formattedBirthDate,
        photoUrl: uploadedImageUrl, // Usa a URL do Cloudinary
      };

      console.log("PAYLOAD", payload)
  
      await signup(payload); // 🔥 Chama a API e autentica automaticamente
  
      toast.success("Cadastro realizado com sucesso!", {position: 'bottom-right'});
      navigate("/"); 
    } catch (error) {
      toast.error(`Erro: ${error}`, {position: 'bottom-right'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Cadastro
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entre com os seus dados para cadastro
            </p>
          </div>
          <div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">

              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                  {/* Imagem de perfil */}
                  <img 
                    src={photoUrl || avatarDefault} 
                    alt="Foto de perfil" 
                    className="object-cover w-full h-full pointer-events-none" 
                  />
                  
                  {/* Ícone de edição */}
                  <label 
                    className="absolute bottom-2 right-2 bg-gray-800 text-white p-1 rounded-full cursor-pointer hover:bg-gray-700 transition z-20 flex items-center justify-center"
                    htmlFor="photo-upload"
                  >
                    <PencilIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  </label>

                  {/* Input de arquivo escondido */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload} 
                    id="photo-upload"
                  />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">Clique no ícone para alterar</p>
              </div>
              {errors.photoUrl && <span className="text-red-500">{errors.photoUrl.message}</span>}{" "}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Nome<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Seu nome"
                      {...register("name")}
                    />
                  </div>
                  

                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Sobrenome<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="sobrenome"
                      placeholder="Seu sobrenome"
                      {...register("sobrenome")}
                    />
                  </div>
                </div>
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}{" "}
                {errors.sobrenome && <span className="text-red-500">{errors.sobrenome.message}</span>}
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Seu email"
                    {...register("email")}
                  />
                </div>
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Senha<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Sua senha"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                {/* <!-- Confirm Password --> */}
                <div>
                  <Label>
                    Confirmar Senha<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Confirme sua senha"
                      type={showPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                    />
                    <span
                      onClick={() => setShowConfirmePassword(!showConfirmePassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmePassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
              
                {/* <!-- Data de nascimento --> */}
                {/* <!-- https://daypicker.dev/docs/styling - Olhar documentação depois para ajustar o calendário */}
                <div className="sm:col-span-1">
                  <Label>
                    Data de nascimento<span className="text-error-500">*</span>
                  </Label>
                  <DayPicker
                    mode="single"
                    selected={birthDate}
                    onSelect={(date) => {
                      setBirthDate(date); // Atualiza o estado
                      setValue("birthDate", date || undefined); // Atualiza o valor do formulário
                    }}
                    captionLayout="dropdown"
                    required 
                    classNames={{
                      today: `text-lg font-semibold text-gray-800 dark:text-white/90`, // Add a border to today's date
                      selected: `text-lg font-semibold text-gray-800 dark:text-white/90`, // Highlight the selected day
                      root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
                      chevron: `${defaultClassNames.chevron} text-gray-800 dark:text-white/90` // Change the color of the chevron
                    }}
                  />
                </div>
                {errors.birthDate && <span className="text-red-500">{errors.birthDate.message}</span>}

                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Ao criar uma conta, você concorda com os{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Termos e condições,
                    </span>{" "}
                    e com{" "}
                    <span className="text-gray-800 dark:text-white">
                    Políticas de Privacidade
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button disabled={!isChecked} type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-green-500 shadow-theme-xs hover:bg-green-400">
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Já tem uma conta? {""}
                <Link
                  to="/sign-in"
                  className="text-brand-500 hover:text-green-600 dark:text-green-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
