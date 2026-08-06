import Image from "next/image";
import { whatsappProof } from "@/data/proof";
import { WhatsAppIcon } from "./icons";

/**
 * Customer WhatsApp messages, shown as redacted screenshots.
 *
 * Deliberately presented as photographs of real messages rather than restyled
 * quote cards: the credibility comes from it visibly being an artefact, not a
 * designed testimonial. The transcribed text carries the alt so the proof is
 * available to screen readers and to search engines, which cannot read an image.
 */
export default function WhatsAppProofStrip() {
  if (whatsappProof.length === 0) return null;

  return (
    <div className="proof">
      <ul className="proof__strip">
        {whatsappProof.map((item) => (
          <li className="proof__item" key={item.id}>
            <figure>
              <Image
                src={item.image}
                alt={`הודעה מלקוח: ${item.quote}`}
                width={600}
                height={800}
              />
              <figcaption>
                <WhatsAppIcon />
                <span>
                  <strong>{item.name}</strong>
                  {item.context ? <span> · {item.context}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="proof__note">
        צילומי מסך של הודעות מלקוחות, מפורסמים באישורם. פרטים מזהים הוסתרו.
      </p>
    </div>
  );
}
